import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection, row_to_dict
from app.schemas import CampaignJoinRequest, CampaignApprovalRequest
from app.auth import get_current_user
from app.ai.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/campaigns", tags=["Procurement Campaigns"])

@router.get("/")
def get_campaigns(status_filter: Optional[str] = None):
    conn = get_connection()
    query = "SELECT * FROM procurement_campaigns WHERE 1=1"
    params = []
    if status_filter:
        query += " AND status = ?"
        params.append(status_filter)
    query += " ORDER BY created_at DESC"
    
    rows = conn.execute(query, params).fetchall()
    campaigns = [row_to_dict(r) for r in rows]

    for c in campaigns:
        p_rows = conn.execute("SELECT cp.*, u.full_name as user_name, u.email as user_email FROM campaign_participants cp JOIN users u ON cp.user_id = u.id WHERE cp.campaign_id = ?", (c["id"],)).fetchall()
        c["participants"] = [row_to_dict(p) for p in p_rows]
        c["participants_count"] = len(c["participants"])

        q_rows = conn.execute("SELECT sq.*, s.business_name as supplier_name, p.name as product_name FROM supplier_quotes sq JOIN suppliers s ON sq.supplier_id = s.id JOIN products p ON sq.product_id = p.id WHERE sq.campaign_id = ?", (c["id"],)).fetchall()
        c["quotes"] = [row_to_dict(q) for q in q_rows]

    conn.close()
    return campaigns

@router.get("/{campaign_id}")
def get_campaign(campaign_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")
    c = row_to_dict(row)

    p_rows = conn.execute("SELECT cp.*, u.full_name as user_name, u.email as user_email FROM campaign_participants cp JOIN users u ON cp.user_id = u.id WHERE cp.campaign_id = ?", (c["id"],)).fetchall()
    c["participants"] = [row_to_dict(p) for p in p_rows]
    c["participants_count"] = len(c["participants"])

    q_rows = conn.execute("SELECT sq.*, s.business_name as supplier_name, p.name as product_name FROM supplier_quotes sq JOIN suppliers s ON sq.supplier_id = s.id JOIN products p ON sq.product_id = p.id WHERE sq.campaign_id = ?", (c["id"],)).fetchall()
    c["quotes"] = [row_to_dict(q) for q in q_rows]

    conn.close()
    return c

@router.post("/{campaign_id}/join")
def join_campaign(
    campaign_id: str,
    join_in: CampaignJoinRequest,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = row_to_dict(row)

    if campaign["status"] in ["Purchased", "Delivered", "Cancelled", "Refunded"]:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Campaign is in '{campaign['status']}' state and no longer accepting participants.")

    part_row = conn.execute(
        "SELECT * FROM campaign_participants WHERE campaign_id = ? AND user_id = ?",
        (campaign_id, current_user["id"])
    ).fetchone()

    expected_contribution = round(join_in.quantity * campaign["estimated_unit_price"], 2)
    now_str = datetime.utcnow().isoformat()

    if part_row:
        conn.execute("""
            UPDATE campaign_participants
            SET quantity = quantity + ?, expected_contribution = expected_contribution + ?
            WHERE id = ?
        """, (join_in.quantity, expected_contribution, part_row["id"]))
    else:
        part_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO campaign_participants (
                id, campaign_id, user_id, demand_id, quantity, expected_contribution,
                authorized_amount, paid_amount, refund_status, approved, joined_at
            ) VALUES (?, ?, ?, ?, ?, ?, 0.0, 0.0, 'NONE', 1, ?)
        """, (part_id, campaign_id, current_user["id"], join_in.demand_id, join_in.quantity, expected_contribution, now_str))

    new_total_qty = campaign["current_quantity"] + join_in.quantity
    new_funding = round(new_total_qty * campaign["estimated_unit_price"], 2)
    new_status = campaign["status"]

    if new_total_qty >= campaign["min_required_quantity"] and campaign["status"] in ["Discovering Demand", "Proposal Ready", "Awaiting Buyer Approval"]:
        new_status = "Threshold Achieved"

    conn.execute("""
        UPDATE procurement_campaigns
        SET current_quantity = ?, current_funding = ?, status = ?
        WHERE id = ?
    """, (new_total_qty, new_funding, new_status, campaign_id))
    conn.commit()
    conn.close()

    return {
        "message": f"Successfully committed {join_in.quantity} units to campaign '{campaign['title']}'.",
        "expected_contribution": expected_contribution,
        "current_total_quantity": new_total_qty,
        "status": new_status
    }

@router.post("/{campaign_id}/approve")
def approve_campaign_proposal(
    campaign_id: str,
    approval_in: CampaignApprovalRequest,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    c_row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = row_to_dict(c_row)

    now_str = datetime.utcnow().isoformat()
    app_row = conn.execute("SELECT id FROM campaign_approvals WHERE campaign_id = ? AND user_id = ?", (campaign_id, current_user["id"])).fetchone()
    if app_row:
        conn.execute("UPDATE campaign_approvals SET approved = ?, approval_notes = ?, timestamp = ? WHERE id = ?", (1 if approval_in.approved else 0, approval_in.notes, now_str, app_row["id"]))
    else:
        app_id = str(uuid.uuid4())
        conn.execute("INSERT INTO campaign_approvals (id, campaign_id, user_id, approved, approval_notes, timestamp) VALUES (?, ?, ?, ?, ?, ?)", (app_id, campaign_id, current_user["id"], 1 if approval_in.approved else 0, approval_in.notes, now_str))
    conn.commit()

    # Re-evaluate with Coordinator Agent
    q_rows = conn.execute("SELECT * FROM supplier_quotes WHERE campaign_id = ?", (campaign_id,)).fetchall()
    quotes = [row_to_dict(q) for q in q_rows]
    p_rows = conn.execute("SELECT * FROM campaign_participants WHERE campaign_id = ?", (campaign_id,)).fetchall()
    participants = [row_to_dict(p) for p in p_rows]
    a_rows = conn.execute("SELECT * FROM campaign_approvals WHERE campaign_id = ?", (campaign_id,)).fetchall()
    approvals = [row_to_dict(a) for a in a_rows]

    pipeline_res = AgentOrchestrator.execute_campaign_evaluation_pipeline(
        campaign_data=campaign,
        quotes=quotes,
        participants=participants,
        approvals=approvals
    )

    coord_output = pipeline_res["coordinator_summary"]["output"]
    if coord_output.get("is_ready_for_execution"):
        conn.execute("UPDATE procurement_campaigns SET status = 'Threshold Achieved' WHERE id = ?", (campaign_id,))
        conn.commit()

    conn.close()
    return {
        "status": "success",
        "user_approved": approval_in.approved,
        "coordinator_summary": coord_output
    }

@router.post("/{campaign_id}/status")
def update_campaign_status(
    campaign_id: str,
    new_status: str,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    c_row = conn.execute("SELECT id FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")

    valid_statuses = [
        "Discovering Demand", "Awaiting Supplier Quotes", "Proposal Ready",
        "Awaiting Buyer Approval", "Funding Pending", "Threshold Achieved",
        "Procurement Processing", "Purchased", "Delivered", "Cancelled", "Refunded"
    ]
    if new_status not in valid_statuses:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Invalid status. Choose from: {valid_statuses}")

    conn.execute("UPDATE procurement_campaigns SET status = ? WHERE id = ?", (new_status, campaign_id))
    conn.commit()
    conn.close()
    return {"message": f"Campaign status updated to '{new_status}'", "status": new_status}

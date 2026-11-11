from fastapi import APIRouter, HTTPException
from app.db import get_connection, row_to_dict

router = APIRouter(prefix="/ledger", tags=["Transparent Procurement Ledger"])

@router.get("/campaign/{campaign_id}")
def get_campaign_ledger(campaign_id: str):
    conn = get_connection()
    c_row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = row_to_dict(c_row)

    entries_rows = conn.execute("SELECT * FROM financial_ledger WHERE campaign_id = ? ORDER BY created_at ASC", (campaign_id,)).fetchall()
    entries = [row_to_dict(e) for e in entries_rows]

    part_rows = conn.execute("SELECT cp.*, u.full_name as user_name FROM campaign_participants cp JOIN users u ON cp.user_id = u.id WHERE cp.campaign_id = ?", (campaign_id,)).fetchall()
    participants = [row_to_dict(p) for p in part_rows]
    conn.close()

    qty = campaign["current_quantity"]
    indiv_market_price = campaign["individual_market_unit_price"]
    negotiated_price = campaign["final_unit_price"] or campaign["estimated_unit_price"]

    total_indiv_cost = round(qty * indiv_market_price, 2)
    negotiated_subtotal = round(qty * negotiated_price, 2)
    tax_cost = round(negotiated_subtotal * 0.08, 2)
    delivery_cost = 250.0 if qty > 0 else 0.0
    actual_collective_cost = round(negotiated_subtotal + tax_cost + delivery_cost, 2)
    
    total_savings = round(total_indiv_cost - actual_collective_cost, 2)
    savings_pct = round((total_savings / total_indiv_cost * 100.0), 1) if total_indiv_cost > 0 else 0.0

    participant_breakdown = []
    for p in participants:
        p_indiv = round(p["quantity"] * indiv_market_price, 2)
        share = p["quantity"] / qty if qty > 0 else 0.0
        p_alloc = round((negotiated_subtotal + tax_cost + delivery_cost) * share, 2)
        p_saving = round(p_indiv - p_alloc, 2)
        participant_breakdown.append({
            "participant_id": p["id"],
            "user_name": p.get("user_name", "Anonymous Buyer"),
            "quantity": p["quantity"],
            "individual_baseline": p_indiv,
            "allocated_collective_cost": p_alloc,
            "net_savings": p_saving,
            "savings_pct": round((p_saving / p_indiv * 100.0), 1) if p_indiv > 0 else 0.0,
            "authorized_amount": p["authorized_amount"],
            "paid_amount": p["paid_amount"],
            "refund_status": p["refund_status"]
        })

    is_finalized = campaign["status"] in ["Purchased", "Delivered"]

    return {
        "campaign_id": campaign["id"],
        "campaign_title": campaign["title"],
        "status": campaign["status"],
        "is_finalized": is_finalized,
        "financial_summary": {
            "total_quantity": qty,
            "individual_market_unit_price": indiv_market_price,
            "collective_unit_price": negotiated_price,
            "total_individual_cost_baseline": total_indiv_cost,
            "procurement_subtotal": negotiated_subtotal,
            "taxes": tax_cost,
            "delivery_expenses": delivery_cost,
            "actual_collective_cost": actual_collective_cost,
            "total_savings": total_savings,
            "savings_percentage": savings_pct,
            "savings_guarantee_notice": "Guaranteed & settled" if is_finalized else "Estimated projection based on current supplier quotes and volume tiers."
        },
        "participant_allocations": participant_breakdown,
        "ledger_entries": entries
    }

@router.get("/all")
def get_all_ledger_records():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM financial_ledger ORDER BY created_at DESC LIMIT 100").fetchall()
    records = [row_to_dict(r) for r in rows]
    conn.close()
    return records

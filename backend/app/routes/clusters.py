import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection, row_to_dict
from app.auth import get_current_user

router = APIRouter(prefix="/clusters", tags=["Demand Clusters"])

@router.get("/")
def get_clusters():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM demand_clusters ORDER BY demand_liquidity_score DESC").fetchall()
    clusters = [row_to_dict(r) for r in rows]
    
    # Attach connected matches
    for c in clusters:
        match_rows = conn.execute("SELECT * FROM demand_matches WHERE cluster_id = ?", (c["id"],)).fetchall()
        c["matches"] = [row_to_dict(m) for m in match_rows]
    
    conn.close()
    return clusters

@router.get("/{cluster_id}")
def get_cluster(cluster_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM demand_clusters WHERE id = ?", (cluster_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Demand cluster not found")
    cluster = row_to_dict(row)
    
    match_rows = conn.execute("SELECT * FROM demand_matches WHERE cluster_id = ?", (cluster_id,)).fetchall()
    cluster["matches"] = [row_to_dict(m) for m in match_rows]
    conn.close()
    return cluster

@router.post("/{cluster_id}/create-campaign")
def transform_cluster_to_campaign(
    cluster_id: str,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    cluster_row = conn.execute("SELECT * FROM demand_clusters WHERE id = ?", (cluster_id,)).fetchone()
    if not cluster_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Demand cluster not found")
    cluster = row_to_dict(cluster_row)

    existing = conn.execute("SELECT * FROM procurement_campaigns WHERE cluster_id = ?", (cluster_id,)).fetchone()
    if existing:
        conn.close()
        return row_to_dict(existing)

    market_unit_price = round(cluster["total_budget"] / cluster["total_quantity"] if cluster["total_quantity"] else 100.0, 2)
    est_bulk_price = round(market_unit_price * 0.82, 2)
    campaign_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()

    conn.execute("""
        INSERT INTO procurement_campaigns (
            id, cluster_id, title, product_name, category, target_quantity,
            current_quantity, min_required_quantity, target_funding, current_funding,
            estimated_unit_price, individual_market_unit_price, status, deadline,
            delivery_estimate, is_demo, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Proposal Ready', '2026-12-15', '14-21 Business Days', 0, ?)
    """, (
        campaign_id, cluster["id"], f"Bulk Collective Procurement: {cluster['target_product']}",
        cluster["target_product"], cluster["category"], cluster["total_quantity"],
        int(cluster["total_quantity"] * 0.75), int(cluster["total_quantity"] * 0.60),
        round(cluster["total_quantity"] * est_bulk_price, 2),
        round(int(cluster["total_quantity"] * 0.75) * est_bulk_price, 2),
        est_bulk_price, market_unit_price, now_str
    ))
    conn.execute("UPDATE demand_clusters SET status = 'ready_for_campaign' WHERE id = ?", (cluster_id,))
    conn.commit()

    saved_row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    res = row_to_dict(saved_row)
    conn.close()
    return res

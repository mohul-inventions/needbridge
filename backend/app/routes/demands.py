import json
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection, row_to_dict
from app.schemas import DemandRequestCreate
from app.auth import get_current_user, get_optional_user
from app.ai.orchestrator import AgentOrchestrator
from app.ai.demand_agent import DemandIntelligenceAgent
from app.ai.community_agent import CommunityDiscoveryAgent
from app.ai.alternative_agent import AlternativeProductAgent

router = APIRouter(prefix="/demands", tags=["Demand Intelligence"])

@router.post("/")
def create_demand(
    demand_in: DemandRequestCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    demand_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()
    specs_json = json.dumps(demand_in.specs or {})
    buyer_type = current_user.get("role", "individual") if current_user.get("role") in ["individual", "organization"] else demand_in.buyer_type

    conn.execute("""
        INSERT INTO demand_requests (
            id, user_id, organization_id, product_name, category, description,
            quantity, max_budget_per_unit, specs, delivery_location, delivery_region,
            required_delivery_date, alternative_preference, buyer_type, status, is_demo, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0, ?)
    """, (
        demand_id, current_user["id"], current_user.get("organization_id"),
        demand_in.product_name, demand_in.category, demand_in.description,
        demand_in.quantity, demand_in.max_budget_per_unit, specs_json,
        demand_in.delivery_location, demand_in.delivery_region,
        demand_in.required_delivery_date, demand_in.alternative_preference,
        buyer_type, now_str
    ))
    conn.commit()

    # Trigger Multi-Agent Pipeline for this new requirement!
    rows = conn.execute("SELECT * FROM demand_requests WHERE status = 'active'").fetchall()
    pool = [row_to_dict(r) for r in rows]

    target_dict = {
        "id": demand_id,
        "product_name": demand_in.product_name,
        "category": demand_in.category,
        "description": demand_in.description,
        "quantity": demand_in.quantity,
        "max_budget_per_unit": demand_in.max_budget_per_unit,
        "specs": demand_in.specs or {},
        "delivery_region": demand_in.delivery_region,
        "buyer_type": buyer_type
    }

    pipeline_res = AgentOrchestrator.execute_demand_pipeline(target_dict, pool)
    comm_output = pipeline_res["community_discovery"]["output"]

    if comm_output.get("compatible_matches"):
        # Auto-create or link cluster
        cluster_row = conn.execute(
            "SELECT * FROM demand_clusters WHERE category = ? AND status IN ('forming', 'ready_for_campaign') LIMIT 1",
            (demand_in.category,)
        ).fetchone()

        if not cluster_row:
            cluster_id = str(uuid.uuid4())
            conn.execute("""
                INSERT INTO demand_clusters (
                    id, cluster_name, category, target_product, total_quantity, total_budget,
                    buyer_count, geographic_focus, demand_liquidity_score, liquidity_factors,
                    growth_projection, status, is_demo, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'forming', 0, ?)
            """, (
                cluster_id, comm_output["cluster_name"], demand_in.category, demand_in.product_name,
                comm_output["total_quantity"], comm_output["total_budget"], comm_output["buyer_count"],
                demand_in.delivery_region, comm_output["liquidity_data"]["score"],
                json.dumps(comm_output["liquidity_data"]["factors"]),
                comm_output["growth_projection"], now_str
            ))
        else:
            cluster_id = cluster_row["id"]

        match_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO demand_matches (
                id, cluster_id, demand_id, match_score, compatibility_explanation,
                shared_specs, differences, potential_savings_pct, approved_by_user, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (
            match_id, cluster_id, demand_id, comm_output["liquidity_data"]["score"],
            pipeline_res["community_discovery"]["decision_explanation"],
            json.dumps(pipeline_res["demand_intelligence"]["output"].get("semantic_tokens", [])),
            json.dumps([]), 18.5, now_str
        ))
        conn.commit()

    saved_row = conn.execute("SELECT * FROM demand_requests WHERE id = ?", (demand_id,)).fetchone()
    res = row_to_dict(saved_row)
    conn.close()
    return res

@router.get("/")
def get_demands(
    category: Optional[str] = None,
    mine: bool = False,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    conn = get_connection()
    query = "SELECT * FROM demand_requests WHERE 1=1"
    params = []
    if mine and current_user:
        query += " AND user_id = ?"
        params.append(current_user["id"])
    if category:
        query += " AND category = ?"
        params.append(category)
    query += " ORDER BY created_at DESC"
    
    rows = conn.execute(query, params).fetchall()
    results = [row_to_dict(r) for r in rows]
    conn.close()
    return results

@router.get("/{demand_id}")
def get_demand(demand_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM demand_requests WHERE id = ?", (demand_id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Demand requirement not found")
    return row_to_dict(row)

@router.post("/preview-analysis")
def analyze_requirement_preview(demand_in: DemandRequestCreate):
    conn = get_connection()
    raw_title = demand_in.product_name
    raw_desc = demand_in.description
    
    d_res = DemandIntelligenceAgent.analyze_requirement(raw_title, raw_desc, demand_in.category, demand_in.specs)
    extracted = d_res["output"]["extracted_specs"]

    active_rows = conn.execute("SELECT * FROM demand_requests WHERE status = 'active'").fetchall()
    pool = [row_to_dict(r) for r in active_rows]
    conn.close()

    target = {
        "id": "preview-target",
        "product_name": raw_title,
        "category": demand_in.category,
        "description": raw_desc,
        "quantity": demand_in.quantity,
        "max_budget_per_unit": demand_in.max_budget_per_unit,
        "specs": extracted,
        "delivery_region": demand_in.delivery_region,
        "buyer_type": demand_in.buyer_type
    }

    c_res = CommunityDiscoveryAgent.discover_clusters(target, pool)
    a_res = AlternativeProductAgent.evaluate_alternatives(raw_title, demand_in.category, extracted)

    return {
        "demand_intelligence": d_res,
        "community_discovery": c_res,
        "alternatives": a_res
    }

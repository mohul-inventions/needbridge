from typing import List, Optional
from fastapi import APIRouter
from app.db import get_connection, row_to_dict
from app.ai.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/agents", tags=["AI Agent Activity Center"])

@router.get("/activity")
def get_agent_activity(limit: int = 50, agent_name: Optional[str] = None):
    conn = get_connection()
    query = "SELECT * FROM agent_executions WHERE 1=1"
    params = []
    if agent_name:
        query += " AND agent_name = ?"
        params.append(agent_name)
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(limit)

    rows = conn.execute(query, params).fetchall()
    executions = [row_to_dict(r) for r in rows]
    conn.close()
    return executions

@router.get("/risk-assessments")
def get_risk_assessments():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM risk_assessments ORDER BY assessed_at DESC LIMIT 30").fetchall()
    risks = [row_to_dict(r) for r in rows]
    conn.close()
    return risks

@router.post("/run-demonstration")
def trigger_agent_demonstration():
    demo_demand = {
        "id": "live-demo-cluster-req",
        "product_name": "STEM Coding Laptop Core i7 16GB",
        "category": "Laptops & Computing",
        "description": "High-durability development laptops for computer science cohort and community robotics lab.",
        "quantity": 40,
        "max_budget_per_unit": 950.0,
        "specs": {"ram": "16GB", "storage": "512GB SSD", "processor": "Intel Core i7", "os": "Ubuntu/Windows"},
        "delivery_region": "North America",
        "buyer_type": "university"
    }

    pool = [
        {
            "id": "pool-polytech",
            "product_name": "Developer Laptops for Students",
            "category": "Laptops & Computing",
            "description": "35 units for vocational programming curriculum.",
            "quantity": 35,
            "max_budget_per_unit": 900.0,
            "specs": {"ram": "16GB", "storage": "512GB SSD", "processor": "Core i7"},
            "delivery_region": "North America",
            "buyer_type": "technical_institute",
            "user_name": "Metropolitan Technical Institute"
        },
        {
            "id": "pool-community-lab",
            "product_name": "Computer Science Laptops",
            "category": "Laptops & Computing",
            "description": "25 laptops for community youth coding center.",
            "quantity": 25,
            "max_budget_per_unit": 920.0,
            "specs": {"ram": "16GB", "storage": "512GB SSD", "processor": "i7"},
            "delivery_region": "North America",
            "buyer_type": "community_org",
            "user_name": "Youth Code Collective"
        }
    ]

    demand_pipeline = AgentOrchestrator.execute_demand_pipeline(demo_demand, pool)

    quotes = [
        {
            "id": "quote-live-apex",
            "supplier_id": "sup-apex",
            "supplier_name": "Apex Enterprise Computing Ltd.",
            "proposed_unit_price": 760.0,
            "min_qty": 50,
            "bulk_discount_pct": 12.0,
            "delivery_fee": 180.0,
            "tax_pct": 8.0,
            "estimated_delivery_days": 10,
            "supplier_rating": 4.9,
            "is_demo": True
        },
        {
            "id": "quote-live-nexis",
            "supplier_id": "sup-nexis",
            "supplier_name": "Nexis Global Hardware",
            "proposed_unit_price": 785.0,
            "min_qty": 20,
            "bulk_discount_pct": 8.0,
            "delivery_fee": 220.0,
            "tax_pct": 8.0,
            "estimated_delivery_days": 7,
            "supplier_rating": 4.6,
            "is_demo": True
        }
    ]

    participants = [
        {"user_id": "user-demo-1", "quantity": 40, "authorized_amount": 30400.0, "paid_amount": 30400.0},
        {"user_id": "user-demo-2", "quantity": 35, "authorized_amount": 26600.0, "paid_amount": 26600.0},
        {"user_id": "user-demo-3", "quantity": 25, "authorized_amount": 19000.0, "paid_amount": 19000.0}
    ]

    approvals = [
        {"user_id": "user-demo-1", "approved": True},
        {"user_id": "user-demo-2", "approved": True},
        {"user_id": "user-demo-3", "approved": True}
    ]

    campaign_data = {
        "id": "live-demo-campaign",
        "title": "Cross-Community STEM Laptop Collective Procurement",
        "target_quantity": 100,
        "min_required_quantity": 80,
        "estimated_unit_price": 760.0,
        "individual_market_unit_price": 950.0,
        "status": "Proposal Ready"
    }

    campaign_pipeline = AgentOrchestrator.execute_campaign_evaluation_pipeline(
        campaign_data=campaign_data,
        quotes=quotes,
        participants=participants,
        approvals=approvals
    )

    return {
        "status": "success",
        "message": "All 7 AI Agents executed successfully. Recorded to auditable execution timeline.",
        "results": {
            "demand_pipeline": demand_pipeline,
            "campaign_pipeline": campaign_pipeline
        }
    }

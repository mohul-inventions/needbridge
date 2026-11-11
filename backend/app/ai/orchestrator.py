import json
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.db import get_connection
from app.ai.demand_agent import DemandIntelligenceAgent
from app.ai.community_agent import CommunityDiscoveryAgent
from app.ai.procurement_agent import ProcurementOptimizationAgent
from app.ai.alternative_agent import AlternativeProductAgent
from app.ai.financial_agent import FinancialIntelligenceAgent
from app.ai.risk_agent import RiskAndTrustAgent
from app.ai.coordinator_agent import ProcurementCoordinatorAgent

class AgentOrchestrator:
    """
    Coordinates execution of all 7 specialized NEEDBRIDGE agents,
    records auditable execution traces to database, and maintains workflow integrity.
    """

    @staticmethod
    def record_execution(
        agent_result: Dict[str, Any],
        input_summary: str,
        related_entity_id: Optional[str] = None
    ):
        try:
            conn = get_connection()
            exec_id = str(uuid.uuid4())
            agent_name = agent_result.get("agent_name", "Unknown Agent")
            output_json = json.dumps(agent_result.get("output", {}))
            execution_time_ms = agent_result.get("execution_time_ms", 50)
            status_val = agent_result.get("status", "completed")
            decision_expl = agent_result.get("decision_explanation", "")
            now_str = datetime.utcnow().isoformat()

            conn.execute("""
                INSERT INTO agent_executions (id, agent_name, input_summary, output_data, execution_time_ms, status, decision_explanation, related_entity_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (exec_id, agent_name, input_summary[:500], output_json, execution_time_ms, status_val, decision_expl, related_entity_id, now_str))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Notice: Error persisting agent execution log: {e}")

    @classmethod
    def execute_demand_pipeline(
        cls,
        demand_data: Dict[str, Any],
        all_pool_demands: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Executes Demand Intelligence -> Community Discovery -> Alternative Search -> Risk Audit.
        """
        # Step 1: Demand Intelligence Agent
        demand_res = DemandIntelligenceAgent.analyze_requirement(
            raw_title=demand_data.get("product_name", ""),
            raw_description=demand_data.get("description", ""),
            category=demand_data.get("category", ""),
            specs=demand_data.get("specs", {})
        )
        cls.record_execution(
            demand_res,
            f"Parsing requirement: {demand_data.get('product_name')}",
            demand_data.get("id")
        )

        # Step 2: Community Discovery Agent
        normalized_demand = dict(demand_data)
        normalized_demand["specs"] = demand_res["output"]["extracted_specs"]
        
        community_res = CommunityDiscoveryAgent.discover_clusters(
            target_demand=normalized_demand,
            pool_demands=all_pool_demands
        )
        cls.record_execution(
            community_res,
            f"Cross-community matching for {demand_data.get('product_name')} across {len(all_pool_demands)} items",
            demand_data.get("id")
        )

        # Step 3: Alternative Product Agent
        alt_res = AlternativeProductAgent.evaluate_alternatives(
            product_name=demand_data.get("product_name", ""),
            category=demand_data.get("category", ""),
            specs=normalized_demand["specs"]
        )
        cls.record_execution(
            alt_res,
            f"Checking compatible alternative specifications for {demand_data.get('product_name')}",
            demand_data.get("id")
        )

        # Step 4: Risk & Trust Agent
        risk_res = RiskAndTrustAgent.audit_demand_submission(
            demand=demand_data,
            recent_user_demands=all_pool_demands
        )
        cls.record_execution(
            risk_res,
            f"Risk & Trust audit for requirement {demand_data.get('product_name')}",
            demand_data.get("id")
        )

        return {
            "demand_intelligence": demand_res,
            "community_discovery": community_res,
            "alternatives": alt_res,
            "risk_assessment": risk_res
        }

    @classmethod
    def execute_campaign_evaluation_pipeline(
        cls,
        campaign_data: Dict[str, Any],
        quotes: List[Dict[str, Any]],
        participants: List[Dict[str, Any]],
        approvals: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Executes Procurement Optimization -> Financial Intelligence -> Risk Audit -> Procurement Coordinator.
        """
        target_qty = campaign_data.get("target_quantity", 100)
        
        # Step 1: Procurement Optimization Agent
        proc_res = ProcurementOptimizationAgent.evaluate_quotations(
            target_quantity=target_qty,
            quotes=quotes
        )
        cls.record_execution(
            proc_res,
            f"Evaluating {len(quotes)} supplier quotations for {campaign_data.get('title')}",
            campaign_data.get("id")
        )

        best_quote = proc_res["output"].get("best_quote")
        bulk_price = best_quote["discounted_unit_price"] if best_quote else campaign_data.get("estimated_unit_price", 100)
        market_price = campaign_data.get("individual_market_unit_price", bulk_price * 1.25)

        # Step 2: Financial Intelligence Agent
        current_committed = sum(p.get("quantity", 0) for p in participants)
        fin_res = FinancialIntelligenceAgent.calculate_procurement_finances(
            market_individual_unit_price=market_price,
            negotiated_bulk_unit_price=bulk_price,
            target_quantity=target_qty,
            current_committed_quantity=current_committed or target_qty,
            participants=participants
        )
        cls.record_execution(
            fin_res,
            f"Auditing ledger finances for {campaign_data.get('title')}",
            campaign_data.get("id")
        )

        # Step 3: Risk & Trust Agent on Selected Quote
        supplier_dummy = {
            "is_verified": True,
            "rating": best_quote.get("supplier_rating", 4.7) if best_quote else 4.5
        }
        risk_res = RiskAndTrustAgent.audit_quotation(
            quote=best_quote or {},
            historical_median_price=market_price,
            supplier=supplier_dummy
        )
        cls.record_execution(
            risk_res,
            f"Risk audit on preferred supplier quote for {campaign_data.get('title')}",
            campaign_data.get("id")
        )

        # Step 4: Procurement Coordinator Agent
        coord_res = ProcurementCoordinatorAgent.evaluate_campaign_readiness(
            campaign=campaign_data,
            participants=participants,
            approvals=approvals,
            selected_quote=best_quote,
            risk_data=risk_res["output"]
        )
        cls.record_execution(
            coord_res,
            f"Coordinating campaign status readiness for {campaign_data.get('title')}",
            campaign_data.get("id")
        )

        return {
            "procurement_optimization": proc_res,
            "financial_intelligence": fin_res,
            "risk_assessment": risk_res,
            "coordinator_summary": coord_res
        }

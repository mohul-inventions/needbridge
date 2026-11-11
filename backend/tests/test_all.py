import unittest
from app.ai.embeddings import SemanticMatcher
from app.ai.demand_agent import DemandIntelligenceAgent
from app.ai.community_agent import CommunityDiscoveryAgent
from app.ai.procurement_agent import ProcurementOptimizationAgent
from app.ai.alternative_agent import AlternativeProductAgent
from app.ai.financial_agent import FinancialIntelligenceAgent
from app.ai.risk_agent import RiskAndTrustAgent
from app.ai.coordinator_agent import ProcurementCoordinatorAgent
from app.auth import get_password_hash, verify_password, create_access_token
import jwt
from app.config import settings

class TestNeedBridgeCore(unittest.TestCase):

    def test_password_hashing(self):
        password = "SecureFintechPassword123!"
        hashed = get_password_hash(password)
        self.assertNotEqual(password, hashed)
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("WrongPassword", hashed))

    def test_jwt_token_generation(self):
        payload = {"sub": "user-uuid-123", "role": "organization"}
        token = create_access_token(payload)
        self.assertIsInstance(token, str)
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        self.assertEqual(decoded["sub"], "user-uuid-123")
        self.assertEqual(decoded["role"], "organization")

    def test_semantic_similarity(self):
        text_a = "Need 50 programming laptops for computer science cohort"
        text_b = "Looking for 50 developer laptops for computer science students"
        sim = SemanticMatcher.compute_similarity(text_a, text_b)
        self.assertGreater(sim, 0.45)

        unrelated = "Commercial high back ergonomic mesh office chairs"
        sim_low = SemanticMatcher.compute_similarity(text_a, unrelated)
        self.assertLess(sim_low, sim)

    def test_specification_compatibility(self):
        score, shared, diffs, expl = SemanticMatcher.evaluate_specs_compatibility(
            "Laptops & Computing", {"ram": "16GB", "storage": "512GB SSD"},
            "Laptops & Computing", {"ram": "16GB", "storage": "512GB SSD"},
            "North America", "North America"
        )
        self.assertGreaterEqual(score, 85.0)
        self.assertIn("Matching category: Laptops & Computing", shared)

    def test_demand_intelligence_agent(self):
        res = DemandIntelligenceAgent.analyze_requirement(
            "Need 40 coding laptops",
            "Must have 16GB RAM and 512GB SSD with i7 processor for students.",
            "Laptops & Computing",
            {}
        )
        self.assertEqual(res["status"], "completed")
        specs = res["output"]["extracted_specs"]
        self.assertIn("ram", specs)
        self.assertIn("16GB RAM", specs["ram"])

    def test_community_discovery_and_liquidity_score(self):
        liquidity = CommunityDiscoveryAgent.calculate_liquidity_score(
            buyer_count=4,
            total_quantity=100,
            supplier_count=4,
            geographic_homogeneity=0.85,
            price_spread_ratio=0.80
        )
        self.assertGreater(liquidity["score"], 60.0)
        self.assertEqual(liquidity["interpretation"], "Highly viable opportunity")
        self.assertIn("buyer_density", liquidity["factors"])

    def test_procurement_optimization_agent(self):
        quotes = [
            {
                "id": "q1",
                "supplier_name": "Supplier A",
                "proposed_unit_price": 500.0,
                "min_qty": 20,
                "bulk_discount_pct": 10.0,
                "delivery_fee": 100.0,
                "tax_pct": 8.0,
                "supplier_rating": 4.8,
                "estimated_delivery_days": 7
            },
            {
                "id": "q2",
                "supplier_name": "Supplier B",
                "proposed_unit_price": 480.0,
                "min_qty": 50,
                "bulk_discount_pct": 15.0,
                "delivery_fee": 150.0,
                "tax_pct": 8.0,
                "supplier_rating": 4.9,
                "estimated_delivery_days": 10
            }
        ]
        res = ProcurementOptimizationAgent.evaluate_quotations(target_quantity=100, quotes=quotes)
        self.assertEqual(res["status"], "completed")
        best = res["output"]["best_quote"]
        self.assertEqual(best["supplier_name"], "Supplier B")
        self.assertTrue(best["moq_satisfied"])

    def test_alternative_product_agent(self):
        res = AlternativeProductAgent.evaluate_alternatives(
            "ThinkPad E14 Gen 5", "Laptops & Computing", {"ram": "16GB"}
        )
        self.assertTrue(res["output"]["requires_buyer_consent"])
        self.assertGreater(len(res["output"]["alternatives"]), 0)

    def test_financial_intelligence_agent(self):
        participants = [
            {"user_id": "u1", "quantity": 40, "paid_amount": 28480.0},
            {"user_id": "u2", "quantity": 60, "paid_amount": 42720.0}
        ]
        res = FinancialIntelligenceAgent.calculate_procurement_finances(
            market_individual_unit_price=890.0,
            negotiated_bulk_unit_price=712.0,
            target_quantity=100,
            current_committed_quantity=100,
            participants=participants,
            tax_pct=0.0,
            shipping_total=0.0
        )
        self.assertEqual(res["output"]["total_individual_cost"], 89000.0)
        self.assertEqual(res["output"]["total_collective_cost"], 71200.0)
        self.assertEqual(res["output"]["estimated_collective_savings"], 17800.0)
        self.assertEqual(res["output"]["savings_percentage"], 20.0)

    def test_risk_and_trust_agent(self):
        dummy_quote = {"proposed_unit_price": 200.0, "estimated_delivery_days": 1, "min_qty": 100}
        dummy_supplier = {"is_verified": False, "rating": 3.2}
        res = RiskAndTrustAgent.audit_quotation(dummy_quote, historical_median_price=800.0, supplier=dummy_supplier)
        self.assertIn(res["output"]["risk_level"], ["HIGH", "CRITICAL"])
        self.assertFalse(res["output"]["passed_automated_gate"])

    def test_procurement_coordinator_readiness(self):
        campaign = {"title": "Test Collective", "min_required_quantity": 80, "target_quantity": 100, "status": "Proposal Ready"}
        participants = [{"quantity": 40}, {"quantity": 50}]
        approvals = [{"approved": True}, {"approved": True}]
        quote = {"proposed_unit_price": 700.0}
        risk = {"risk_level": "LOW"}
        res = ProcurementCoordinatorAgent.evaluate_campaign_readiness(campaign, participants, approvals, quote, risk)
        self.assertTrue(res["output"]["is_ready_for_execution"])
        self.assertEqual(res["output"]["recommended_next_status"], "Threshold Achieved")

if __name__ == "__main__":
    unittest.main()

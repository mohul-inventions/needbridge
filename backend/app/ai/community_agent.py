import time
from typing import Dict, Any, List
from app.ai.embeddings import SemanticMatcher

class CommunityDiscoveryAgent:
    name = "Community Discovery Agent"

    @classmethod
    def calculate_liquidity_score(
        cls,
        buyer_count: int,
        total_quantity: int,
        supplier_count: int,
        geographic_homogeneity: float,  # 0.0 to 1.0
        price_spread_ratio: float,      # 0.0 to 1.0 (closeness of buyer budgets)
        historical_success_rate: float = 0.85,
        days_remaining: int = 14
    ) -> Dict[str, Any]:
        """
        Calculates proprietary NEEDBRIDGE Demand Liquidity Score (0-100)
        and factor breakdown.
        """
        # 1. Buyer Density (0-20 pts)
        buyer_score = min(20.0, buyer_count * 2.5)
        
        # 2. Volume Mass vs typical MOQ threshold (0-25 pts)
        volume_score = min(25.0, (total_quantity / 100.0) * 25.0)
        
        # 3. Supplier Availability (0-15 pts)
        supplier_score = min(15.0, supplier_count * 3.75)
        
        # 4. Geographic Alignment (0-15 pts)
        geo_score = geographic_homogeneity * 15.0
        
        # 5. Price Competitiveness & budget alignment (0-15 pts)
        price_score = price_spread_ratio * 15.0
        
        # 6. Historical Success Momentum (0-10 pts)
        hist_score = historical_success_rate * 10.0

        total_score = round(buyer_score + volume_score + supplier_score + geo_score + price_score + hist_score, 1)
        total_score = max(5.0, min(99.0, total_score))

        if total_score >= 81:
            tier = "Highly viable opportunity"
            action = "Immediate campaign generation recommended. High conversion expected."
        elif total_score >= 61:
            tier = "Strong opportunity"
            action = "Procurement ready. Minor supplier bidding optimization suggested."
        elif total_score >= 31:
            tier = "Developing opportunity"
            action = "Cluster coalescing. Recommend cross-community discovery outreach."
        else:
            tier = "Low opportunity"
            action = "Requires broader demand aggregation or budget adjustment."

        return {
            "score": total_score,
            "interpretation": tier,
            "recommended_action": action,
            "is_statistically_validated": False,
            "methodology": "Heuristic Multi-Factor Demand Liquidity Index",
            "factors": {
                "buyer_density": round(buyer_score, 1),
                "volume_mass": round(volume_score, 1),
                "supplier_availability": round(supplier_score, 1),
                "geographic_alignment": round(geo_score, 1),
                "price_competitiveness": round(price_score, 1),
                "historical_success": round(hist_score, 1)
            }
        }

    @classmethod
    def discover_clusters(
        cls,
        target_demand: Dict[str, Any],
        pool_demands: List[Dict[str, Any]],
        available_suppliers: int = 4
    ) -> Dict[str, Any]:
        """
        Discovers compatible requirements across communities (organizations + individuals)
        and forms an optimal demand cluster.
        """
        start_time = time.time()
        compatible_matches = []
        total_qty = target_demand.get("quantity", 1)
        total_budget = target_demand.get("max_budget_per_unit", 100) * total_qty
        communities_detected = set([target_demand.get("buyer_type", "individual")])

        for other in pool_demands:
            if other.get("id") == target_demand.get("id"):
                continue

            # Semantic text similarity
            text_sim = SemanticMatcher.compute_similarity(
                f"{target_demand.get('product_name')} {target_demand.get('description')}",
                f"{other.get('product_name')} {other.get('description')}"
            )

            # Specs compatibility
            score, shared, diffs, expl = SemanticMatcher.evaluate_specs_compatibility(
                target_demand.get("category", "General"),
                target_demand.get("specs", {}),
                other.get("category", "General"),
                other.get("specs", {}),
                target_demand.get("delivery_region", "North America"),
                other.get("delivery_region", "North America")
            )

            # Combined weight
            final_match = round(0.4 * (text_sim * 100) + 0.6 * score, 1)

            if final_match >= 60.0:
                potential_savings = round(12.0 + (final_match / 10.0), 1)
                match_record = {
                    "demand_id": other.get("id"),
                    "buyer_name": other.get("user_name", "Anonymous Community Member"),
                    "buyer_type": other.get("buyer_type", "individual"),
                    "product_name": other.get("product_name"),
                    "quantity": other.get("quantity", 1),
                    "match_score": final_match,
                    "shared_specs": shared,
                    "differences": diffs,
                    "explanation": expl,
                    "potential_savings_pct": potential_savings
                }
                compatible_matches.append(match_record)
                total_qty += other.get("quantity", 1)
                total_budget += other.get("max_budget_per_unit", 100) * other.get("quantity", 1)
                communities_detected.add(other.get("buyer_type", "individual"))

        buyer_count = len(compatible_matches) + 1
        liquidity = cls.calculate_liquidity_score(
            buyer_count=buyer_count,
            total_quantity=total_qty,
            supplier_count=available_suppliers,
            geographic_homogeneity=0.88,
            price_spread_ratio=0.82
        )

        growth_projection = f"+{min(60, buyer_count * 12)}% projected volume in next 10 days"
        elapsed_ms = int((time.time() - start_time) * 1000)

        explanation = (
            f"Identified {len(compatible_matches)} cross-community purchasing counterparts spanning "
            f"{len(communities_detected)} distinct community sectors. Aggregated collective volume to {total_qty} units "
            f"with Demand Liquidity Score of {liquidity['score']}/100 ({liquidity['interpretation']})."
        )

        return {
            "agent_name": cls.name,
            "status": "completed",
            "execution_time_ms": max(15, elapsed_ms),
            "decision_explanation": explanation,
            "output": {
                "cluster_name": f"Collective Lot: {target_demand.get('product_name')}",
                "total_quantity": total_qty,
                "total_budget": total_budget,
                "buyer_count": buyer_count,
                "communities_involved": list(communities_detected),
                "compatible_matches": compatible_matches,
                "liquidity_data": liquidity,
                "growth_projection": growth_projection
            }
        }

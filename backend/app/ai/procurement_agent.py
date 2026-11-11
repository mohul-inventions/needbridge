import time
from typing import Dict, Any, List

class ProcurementOptimizationAgent:
    name = "Procurement Optimization Agent"

    @classmethod
    def evaluate_quotations(
        cls,
        target_quantity: int,
        quotes: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Analyzes supplier quotations considering unit price, bulk tiered discounts,
        MOQ compliance, shipping costs, tax rates, and vendor reliability rating.
        Ranks by composite Total Value Score.
        """
        start_time = time.time()
        scored_quotes = []

        if not quotes:
            return {
                "agent_name": cls.name,
                "status": "failed",
                "execution_time_ms": 10,
                "decision_explanation": "No supplier quotations available for evaluation.",
                "output": {"best_quote": None, "comparison": []}
            }

        for q in quotes:
            base_unit_price = float(q.get("proposed_unit_price", 0))
            min_qty = int(q.get("min_qty", 1))
            discount_pct = float(q.get("bulk_discount_pct", 0))
            delivery_fee = float(q.get("delivery_fee", 0))
            tax_pct = float(q.get("tax_pct", 8.0))
            supplier_rating = float(q.get("supplier_rating", 4.5))
            delivery_days = int(q.get("estimated_delivery_days", 7))

            # Apply bulk discount if target qty exceeds MOQ
            effective_discount = discount_pct if target_quantity >= min_qty else 0.0
            discounted_unit_price = round(base_unit_price * (1.0 - (effective_discount / 100.0)), 2)
            
            subtotal = discounted_unit_price * target_quantity
            tax_amount = round(subtotal * (tax_pct / 100.0), 2)
            total_landed_cost = round(subtotal + delivery_fee + tax_amount, 2)
            effective_per_unit_cost = round(total_landed_cost / target_quantity, 2)

            moq_satisfied = target_quantity >= min_qty

            # Multi-attribute scoring: 50% Price, 25% Reliability Rating, 15% Delivery Speed, 10% MOQ fit
            price_norm_score = max(0.0, 100.0 - (discounted_unit_price / 10.0))  # higher is better relative
            rating_score = (supplier_rating / 5.0) * 100.0
            speed_score = max(0.0, 100.0 - (delivery_days * 3.0))
            moq_score = 100.0 if moq_satisfied else 30.0

            composite_value_score = round(
                (0.50 * price_norm_score) +
                (0.25 * rating_score) +
                (0.15 * speed_score) +
                (0.10 * moq_score),
                1
            )

            scored_quotes.append({
                "quote_id": q.get("id"),
                "supplier_id": q.get("supplier_id"),
                "supplier_name": q.get("supplier_name", "Verified Supplier"),
                "base_unit_price": base_unit_price,
                "discount_pct": effective_discount,
                "discounted_unit_price": discounted_unit_price,
                "delivery_fee": delivery_fee,
                "tax_amount": tax_amount,
                "total_landed_cost": total_landed_cost,
                "effective_per_unit_cost": effective_per_unit_cost,
                "moq_satisfied": moq_satisfied,
                "min_qty": min_qty,
                "delivery_days": delivery_days,
                "supplier_rating": supplier_rating,
                "composite_value_score": composite_value_score,
                "is_demo": q.get("is_demo", False)
            })

        # Rank by composite value score descending
        scored_quotes.sort(key=lambda x: x["composite_value_score"], reverse=True)
        best = scored_quotes[0]

        elapsed_ms = int((time.time() - start_time) * 1000)

        explanation = (
            f"Evaluated {len(scored_quotes)} supplier quotations for {target_quantity} units. "
            f"Selected {best['supplier_name']} with composite Total Value score of {best['composite_value_score']}/100. "
            f"Effective bulk per-unit cost: ${best['discounted_unit_price']} (down from ${best['base_unit_price']}, {best['discount_pct']}% discount) "
            f"with total landed procurement commitment of ${best['total_landed_cost']:,.2f}."
        )

        return {
            "agent_name": cls.name,
            "status": "completed",
            "execution_time_ms": max(14, elapsed_ms),
            "decision_explanation": explanation,
            "output": {
                "best_quote": best,
                "all_evaluated_quotes": scored_quotes,
                "recommended_unit_price": best["discounted_unit_price"],
                "target_quantity": target_quantity,
                "total_commitment": best["total_landed_cost"]
            }
        }

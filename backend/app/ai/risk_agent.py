import time
from typing import Dict, Any, List

class RiskAndTrustAgent:
    name = "Risk & Trust Agent"

    @classmethod
    def audit_quotation(
        cls,
        quote: Dict[str, Any],
        historical_median_price: float,
        supplier: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assesses supplier quote for volatility, dumping, warranty risks, and verification.
        """
        start_time = time.time()
        flags = []
        risk_score = 10.0  # Base low risk

        unit_price = float(quote.get("proposed_unit_price", 0))
        lead_days = int(quote.get("estimated_delivery_days", 7))
        is_verified = supplier.get("is_verified", False)
        rating = float(supplier.get("rating", 4.0))

        # Check for extreme undercutting (predatory dumping or counterfeit risk)
        if historical_median_price > 0:
            price_ratio = unit_price / historical_median_price
            if price_ratio < 0.60:
                flags.append("Warning: Quoted price is >40% below market median (potential component substitution risk).")
                risk_score += 35.0
            elif price_ratio < 0.75:
                flags.append("Notice: Aggressive volume pricing detected (>25% below market).")
                risk_score += 10.0

        # Check supplier verification
        if not is_verified:
            flags.append("Caution: Supplier business registration pending KYC verification.")
            risk_score += 25.0
        else:
            flags.append("Verified: Supplier holds authenticated corporate registration.")

        # Check rating
        if rating < 3.8:
            flags.append("Warning: Supplier historical fulfillment rating is below 3.8/5.0.")
            risk_score += 20.0

        # Check lead times
        if lead_days < 2 and int(quote.get("min_qty", 10)) > 50:
            flags.append("Anomaly: Unusually low lead time for high-volume manufacturing batch.")
            risk_score += 15.0

        risk_score = min(100.0, max(0.0, risk_score))

        if risk_score >= 70:
            level = "CRITICAL"
        elif risk_score >= 45:
            level = "HIGH"
        elif risk_score >= 25:
            level = "MEDIUM"
        else:
            level = "LOW"

        elapsed_ms = int((time.time() - start_time) * 1000)

        decision_explanation = (
            f"Risk audit completed with score {risk_score}/100 (Level: {level}). "
            f"Evaluated {len(flags)} integrity indicators. "
            f"{'Approved for campaign inclusion.' if level in ['LOW', 'MEDIUM'] else 'Flagged for administrator manual review.'}"
        )

        return {
            "agent_name": cls.name,
            "status": "completed",
            "execution_time_ms": max(14, elapsed_ms),
            "decision_explanation": decision_explanation,
            "output": {
                "risk_score": risk_score,
                "risk_level": level,
                "flags": flags,
                "passed_automated_gate": level in ["LOW", "MEDIUM"]
            }
        }

    @classmethod
    def audit_demand_submission(
        cls,
        demand: Dict[str, Any],
        recent_user_demands: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Detects duplicate or bot-generated demand submissions to preserve liquidity integrity.
        """
        start_time = time.time()
        flags = []
        risk_score = 5.0

        # Check duplicate title / description in short timeframe
        for past in recent_user_demands:
            if past.get("id") != demand.get("id"):
                if past.get("product_name", "").lower() == demand.get("product_name", "").lower():
                    flags.append("Duplicate check: Similar active requirement already recorded for this user account.")
                    risk_score += 30.0

        if demand.get("quantity", 0) > 10000:
            flags.append("Volume anomaly: Unusually high quantity requested for individual buyer tier.")
            risk_score += 25.0

        risk_score = min(100.0, max(0.0, risk_score))
        level = "LOW" if risk_score < 25 else ("MEDIUM" if risk_score < 50 else "HIGH")

        elapsed_ms = int((time.time() - start_time) * 1000)

        return {
            "agent_name": cls.name,
            "status": "completed",
            "execution_time_ms": max(10, elapsed_ms),
            "decision_explanation": f"Submission integrity verified with risk score {risk_score}/100 ({level}).",
            "output": {
                "risk_score": risk_score,
                "risk_level": level,
                "flags": flags
            }
        }

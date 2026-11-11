import time
from typing import Dict, Any, List

class ProcurementCoordinatorAgent:
    name = "Procurement Coordinator Agent"

    @classmethod
    def evaluate_campaign_readiness(
        cls,
        campaign: Dict[str, Any],
        participants: List[Dict[str, Any]],
        approvals: List[Dict[str, Any]],
        selected_quote: Dict[str, Any],
        risk_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Coordinates multi-agent states and validates whether collective conditions
        have matured for contract execution.
        """
        start_time = time.time()
        
        current_qty = sum(p.get("quantity", 0) for p in participants)
        min_required = campaign.get("min_required_quantity", 1)
        target_qty = campaign.get("target_quantity", min_required)
        
        approval_count = sum(1 for a in approvals if a.get("approved", False))
        total_participants = len(participants)
        
        threshold_met = current_qty >= min_required
        approval_rate = (approval_count / total_participants * 100.0) if total_participants > 0 else 0.0
        consensus_achieved = approval_rate >= 80.0
        
        risk_acceptable = risk_data.get("risk_level", "LOW") in ["LOW", "MEDIUM"]
        has_quote = selected_quote is not None

        blockers = []
        if not threshold_met:
            blockers.append(f"Volume deficit: Current {current_qty} units is below MOQ threshold of {min_required} units.")
        if not consensus_achieved:
            blockers.append(f"Buyer consensus pending: {approval_count}/{total_participants} approvals ({approval_rate:.0f}% < 80%).")
        if not has_quote:
            blockers.append("No supplier quote has been selected.")
        if not risk_acceptable:
            blockers.append(f"Risk gate flagged: {risk_data.get('risk_level')} risk level.")

        ready = len(blockers) == 0

        # Suggested next status
        current_status = campaign.get("status", "Discovering Demand")
        if ready and current_status in ["Awaiting Buyer Approval", "Proposal Ready"]:
            next_status = "Threshold Achieved"
        elif threshold_met and not ready:
            next_status = "Awaiting Buyer Approval"
        else:
            next_status = current_status

        elapsed_ms = int((time.time() - start_time) * 1000)

        summary = (
            f"Coordinator review: Campaign '{campaign.get('title')}' is "
            f"{'READY FOR PROCUREMENT EXECUTION' if ready else 'ACCUMULATING DEMAND'}. "
            f"Committed: {current_qty}/{target_qty} units ({round(current_qty/target_qty*100, 1) if target_qty else 0}%). "
            f"Consensus: {approval_rate:.1f}%. "
            f"Blockers: {'; '.join(blockers) if blockers else 'None. All conditions satisfied.'}"
        )

        return {
            "agent_name": cls.name,
            "status": "completed",
            "execution_time_ms": max(15, elapsed_ms),
            "decision_explanation": summary,
            "output": {
                "is_ready_for_execution": ready,
                "current_status": current_status,
                "recommended_next_status": next_status,
                "current_quantity": current_qty,
                "min_required_quantity": min_required,
                "target_quantity": target_qty,
                "approval_rate": round(approval_rate, 1),
                "risk_acceptable": risk_acceptable,
                "blockers": blockers,
                "executive_summary": summary
            }
        }

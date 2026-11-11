import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from app.db import get_connection, row_to_dict
from app.schemas import PayPalOrderCreate, PayPalOrderResponse, PayPalCaptureRequest
from app.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Financial Management & PayPal Sandbox"])

@router.post("/create-order", response_model=PayPalOrderResponse)
def create_paypal_order(
    order_in: PayPalOrderCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    c_row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (order_in.campaign_id,)).fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Procurement campaign not found")
    campaign = row_to_dict(c_row)

    amount = round(order_in.quantity * campaign["estimated_unit_price"], 2)
    fake_paypal_order_id = f"PAYPAL-SANDBOX-ORDER-{uuid.uuid4().hex[:12].upper()}"
    tx_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()

    conn.execute("""
        INSERT INTO payment_transactions (
            id, campaign_id, user_id, paypal_order_id, amount, currency,
            status, is_demo, transaction_type, payment_method, created_at
        ) VALUES (?, ?, ?, ?, ?, 'USD', 'CREATED', 1, 'CONTRIBUTION', 'PayPal Sandbox Escrow', ?)
    """, (tx_id, campaign["id"], current_user["id"], fake_paypal_order_id, amount, now_str))

    # Update or insert participant authorization
    part_row = conn.execute("SELECT id FROM campaign_participants WHERE campaign_id = ? AND user_id = ?", (campaign["id"], current_user["id"])).fetchone()
    if not part_row:
        part_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO campaign_participants (
                id, campaign_id, user_id, quantity, expected_contribution, authorized_amount,
                paid_amount, refund_status, approved, joined_at
            ) VALUES (?, ?, ?, ?, ?, ?, 0.0, 'NONE', 1, ?)
        """, (part_id, campaign["id"], current_user["id"], order_in.quantity, amount, amount, now_str))
    else:
        conn.execute("UPDATE campaign_participants SET authorized_amount = ? WHERE id = ?", (amount, part_row["id"]))

    conn.commit()
    conn.close()

    approval_url = f"https://www.sandbox.paypal.com/checkoutnow?token={fake_paypal_order_id}"

    return {
        "order_id": fake_paypal_order_id,
        "approval_url": approval_url,
        "status": "CREATED",
        "amount": amount,
        "currency": "USD"
    }

@router.post("/capture-order")
def capture_paypal_order(
    capture_in: PayPalCaptureRequest,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    tx_row = conn.execute("SELECT * FROM payment_transactions WHERE paypal_order_id = ?", (capture_in.order_id,)).fetchone()
    if not tx_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction order reference not found")
    tx = row_to_dict(tx_row)

    if tx["status"] == "COMPLETED":
        conn.close()
        raise HTTPException(status_code=400, detail="Transaction has already been captured. Duplicate capture prevented.")

    c_row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (capture_in.campaign_id,)).fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Associated campaign not found")
    campaign = row_to_dict(c_row)

    fake_capture_id = f"CAPTURE-{uuid.uuid4().hex[:12].upper()}"
    now_str = datetime.utcnow().isoformat()

    conn.execute("UPDATE payment_transactions SET paypal_capture_id = ?, status = 'COMPLETED' WHERE id = ?", (fake_capture_id, tx["id"]))
    conn.execute("UPDATE campaign_participants SET paid_amount = paid_amount + ? WHERE campaign_id = ? AND user_id = ?", (tx["amount"], campaign["id"], current_user["id"]))

    new_funding = campaign["current_funding"] + tx["amount"]
    new_status = campaign["status"]
    if new_funding >= campaign["target_funding"] and campaign["status"] in ["Threshold Achieved", "Funding Pending"]:
        new_status = "Procurement Processing"

    conn.execute("UPDATE procurement_campaigns SET current_funding = ?, status = ? WHERE id = ?", (new_funding, new_status, campaign["id"]))

    # Ledger entry
    ledger_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO financial_ledger (
            id, campaign_id, user_id, entry_type, amount, currency, description, balance_after, transaction_ref, created_at
        ) VALUES (?, ?, ?, 'ESCROW_HOLD', ?, 'USD', ?, ?, ?, ?)
    """, (
        ledger_id, campaign["id"], current_user["id"], tx["amount"],
        f"PayPal Sandbox Authorized Escrow Contribution from {current_user.get('full_name', 'Buyer')}",
        new_funding, fake_capture_id, now_str
    ))

    conn.commit()
    conn.close()

    return {
        "status": "COMPLETED",
        "capture_id": fake_capture_id,
        "amount_captured": tx["amount"],
        "currency": "USD",
        "campaign_funding_total": new_funding,
        "campaign_status": new_status
    }

@router.post("/refund/{transaction_id}")
def process_refund(
    transaction_id: str,
    current_user: dict = Depends(get_current_user)
):
    conn = get_connection()
    tx_row = conn.execute("SELECT * FROM payment_transactions WHERE id = ?", (transaction_id,)).fetchone()
    if not tx_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Transaction not found")
    tx = row_to_dict(tx_row)

    if tx["status"] == "REFUNDED":
        conn.close()
        raise HTTPException(status_code=400, detail="Transaction is already refunded.")

    if tx["status"] != "COMPLETED":
        conn.close()
        raise HTTPException(status_code=400, detail="Only completed captures can be refunded.")

    now_str = datetime.utcnow().isoformat()
    conn.execute("UPDATE payment_transactions SET status = 'REFUNDED' WHERE id = ?", (tx["id"],))
    conn.execute("UPDATE campaign_participants SET paid_amount = MAX(0.0, paid_amount - ?), refund_status = 'PROCESSED' WHERE campaign_id = ? AND user_id = ?", (tx["amount"], tx["campaign_id"], tx["user_id"]))
    
    c_row = conn.execute("SELECT current_funding FROM procurement_campaigns WHERE id = ?", (tx["campaign_id"],)).fetchone()
    new_fund = max(0.0, c_row["current_funding"] - tx["amount"]) if c_row else 0.0
    conn.execute("UPDATE procurement_campaigns SET current_funding = ? WHERE id = ?", (new_fund, tx["campaign_id"]))

    refund_ref = f"REFUND-{uuid.uuid4().hex[:10].upper()}"
    ledger_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO financial_ledger (
            id, campaign_id, user_id, entry_type, amount, currency, description, balance_after, transaction_ref, created_at
        ) VALUES (?, ?, ?, 'REFUND', ?, 'USD', ?, ?, ?, ?)
    """, (
        ledger_id, tx["campaign_id"], tx["user_id"], -tx["amount"],
        f"PayPal Sandbox Refund to buyer for transaction {tx.get('paypal_capture_id') or tx['paypal_order_id']}",
        new_fund, refund_ref, now_str
    ))

    conn.commit()
    conn.close()

    return {
        "status": "REFUNDED",
        "amount_refunded": tx["amount"],
        "refund_reference": refund_ref
    }

@router.post("/webhook")
async def paypal_webhook(request: Request):
    body = await request.json()
    event_type = body.get("event_type", "CHECKOUT.ORDER.APPROVED")
    resource = body.get("resource", {})
    order_id = resource.get("id")

    return {
        "verified": True,
        "event_type": event_type,
        "order_id": order_id,
        "status": "acknowledged"
    }

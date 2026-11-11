from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection, row_to_dict
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/admin", tags=["Administrator Dashboard"])

@router.get("/users")
def list_all_users(current_user: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    rows = conn.execute("SELECT id, email, full_name, role, phone, address, organization_id, is_active, created_at FROM users ORDER BY created_at DESC").fetchall()
    users = [row_to_dict(r) for r in rows]
    conn.close()
    return users

@router.post("/suppliers/{supplier_id}/toggle-verify")
def toggle_supplier_verification(
    supplier_id: str,
    current_user: dict = Depends(require_role(["admin"]))
):
    conn = get_connection()
    row = conn.execute("SELECT * FROM suppliers WHERE id = ?", (supplier_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    new_verified = 0 if row["is_verified"] else 1
    conn.execute("UPDATE suppliers SET is_verified = ? WHERE id = ?", (new_verified, supplier_id))
    conn.commit()
    conn.close()
    return {
        "supplier_id": supplier_id,
        "business_name": row["business_name"],
        "is_verified": bool(new_verified)
    }

@router.get("/audit-logs")
def get_audit_logs(
    limit: int = 50,
    current_user: dict = Depends(require_role(["admin"]))
):
    conn = get_connection()
    rows = conn.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,)).fetchall()
    logs = [row_to_dict(r) for r in rows]
    conn.close()
    return logs

@router.get("/overview")
def get_admin_overview(current_user: dict = Depends(require_role(["admin"]))):
    conn = get_connection()
    u_cnt = conn.execute("SELECT COUNT(*) as c FROM users").fetchone()["c"]
    s_cnt = conn.execute("SELECT COUNT(*) as c FROM suppliers").fetchone()["c"]
    c_cnt = conn.execute("SELECT COUNT(*) as c FROM procurement_campaigns").fetchone()["c"]
    t_cnt = conn.execute("SELECT COUNT(*) as c FROM payment_transactions").fetchone()["c"]
    conn.close()

    return {
        "total_users": u_cnt,
        "total_suppliers": s_cnt,
        "total_campaigns": c_cnt,
        "total_transactions": t_cnt,
        "system_status": "All systems nominal (Multi-Agent Engine Active)"
    }

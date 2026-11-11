import uuid
import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_connection, row_to_dict
from app.schemas import ProductCreate, SupplierQuoteCreate
from app.auth import get_current_user, require_role
from app.ai.procurement_agent import ProcurementOptimizationAgent

router = APIRouter(prefix="/suppliers", tags=["Supplier Marketplace"])

@router.get("/")
def list_suppliers(category: Optional[str] = None):
    conn = get_connection()
    query = "SELECT s.*, (SELECT COUNT(*) FROM products WHERE supplier_id = s.id) as product_count FROM suppliers s WHERE 1=1"
    params = []
    if category:
        query += " AND s.category = ?"
        params.append(category)
    rows = conn.execute(query, params).fetchall()
    suppliers = [row_to_dict(r) for r in rows]
    conn.close()
    return suppliers

@router.get("/products")
def list_products(category: Optional[str] = None):
    conn = get_connection()
    query = "SELECT p.*, s.business_name as supplier_name FROM products p JOIN suppliers s ON p.supplier_id = s.id WHERE 1=1"
    params = []
    if category:
        query += " AND p.category = ?"
        params.append(category)
    rows = conn.execute(query, params).fetchall()
    products = [row_to_dict(r) for r in rows]
    conn.close()
    return products

@router.post("/products")
def add_product(
    prod_in: ProductCreate,
    current_user: dict = Depends(require_role(["supplier", "admin"]))
):
    conn = get_connection()
    supplier_row = conn.execute("SELECT id FROM suppliers WHERE user_id = ?", (current_user["id"],)).fetchone()
    if not supplier_row and current_user["role"] != "admin":
        conn.close()
        raise HTTPException(status_code=400, detail="Supplier profile not found for this user.")
    
    supplier_id = supplier_row["id"] if supplier_row else conn.execute("SELECT id FROM suppliers LIMIT 1").fetchone()["id"]
    prod_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()

    conn.execute("""
        INSERT INTO products (
            id, supplier_id, name, category, description, specs, base_unit_price,
            min_order_qty, bulk_tiers, delivery_days_estimate, in_stock, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    """, (
        prod_id, supplier_id, prod_in.name, prod_in.category, prod_in.description,
        json.dumps(prod_in.specs or {}), prod_in.base_unit_price, prod_in.min_order_qty,
        json.dumps(prod_in.bulk_tiers or []), prod_in.delivery_days_estimate, now_str
    ))
    conn.commit()
    saved = conn.execute("SELECT * FROM products WHERE id = ?", (prod_id,)).fetchone()
    res = row_to_dict(saved)
    conn.close()
    return res

@router.post("/quotes")
def submit_quote(
    quote_in: SupplierQuoteCreate,
    current_user: dict = Depends(require_role(["supplier", "admin"]))
):
    conn = get_connection()
    supplier_row = conn.execute("SELECT id, business_name FROM suppliers WHERE user_id = ?", (current_user["id"],)).fetchone()
    if not supplier_row and current_user["role"] != "admin":
        conn.close()
        raise HTTPException(status_code=400, detail="Supplier profile not found")
    
    supplier_id = supplier_row["id"] if supplier_row else conn.execute("SELECT id, business_name FROM suppliers LIMIT 1").fetchone()["id"]
    quote_id = str(uuid.uuid4())
    now_str = datetime.utcnow().isoformat()

    conn.execute("""
        INSERT INTO supplier_quotes (
            id, campaign_id, supplier_id, product_id, proposed_unit_price, min_qty,
            bulk_discount_pct, delivery_fee, tax_pct, estimated_delivery_days, status, notes, is_demo, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, 0, ?)
    """, (
        quote_id, quote_in.campaign_id, supplier_id, quote_in.product_id,
        quote_in.proposed_unit_price, quote_in.min_qty, quote_in.bulk_discount_pct,
        quote_in.delivery_fee, quote_in.tax_pct, quote_in.estimated_delivery_days,
        quote_in.notes, now_str
    ))
    conn.commit()
    saved = conn.execute("SELECT sq.*, s.business_name as supplier_name, p.name as product_name FROM supplier_quotes sq JOIN suppliers s ON sq.supplier_id = s.id JOIN products p ON sq.product_id = p.id WHERE sq.id = ?", (quote_id,)).fetchone()
    res = row_to_dict(saved)
    conn.close()
    return res

@router.get("/campaigns/{campaign_id}/compare-quotes")
def compare_campaign_quotes(campaign_id: str):
    conn = get_connection()
    c_row = conn.execute("SELECT * FROM procurement_campaigns WHERE id = ?", (campaign_id,)).fetchone()
    if not c_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign = row_to_dict(c_row)

    q_rows = conn.execute("SELECT sq.*, s.business_name as supplier_name, s.rating as supplier_rating FROM supplier_quotes sq JOIN suppliers s ON sq.supplier_id = s.id WHERE sq.campaign_id = ?", (campaign_id,)).fetchall()
    quotes = [row_to_dict(q) for q in q_rows]
    conn.close()

    opt_result = ProcurementOptimizationAgent.evaluate_quotations(
        target_quantity=campaign["target_quantity"],
        quotes=quotes
    )
    return opt_result

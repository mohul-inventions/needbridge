import sqlite3
import json
import os
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "needbridge.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Users
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'individual',
        phone TEXT,
        address TEXT,
        organization_id TEXT,
        is_active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
    );
    """)

    # 2. Organizations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'Educational Institution',
        registration_number TEXT,
        location TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # 3. Suppliers
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS suppliers (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        business_name TEXT NOT NULL,
        registration_no TEXT,
        category TEXT NOT NULL,
        rating REAL DEFAULT 4.8,
        is_verified INTEGER DEFAULT 1,
        address TEXT,
        contact_email TEXT NOT NULL,
        is_demo INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 4. Products
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        supplier_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        specs TEXT, -- JSON
        base_unit_price REAL NOT NULL,
        min_order_qty INTEGER DEFAULT 1,
        bulk_tiers TEXT, -- JSON
        delivery_days_estimate INTEGER DEFAULT 7,
        in_stock INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY(supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
    );
    """)

    # 5. Demand Requests
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demand_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        organization_id TEXT,
        product_name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        max_budget_per_unit REAL NOT NULL,
        specs TEXT, -- JSON
        delivery_location TEXT NOT NULL,
        delivery_region TEXT DEFAULT 'North America',
        required_delivery_date TEXT NOT NULL,
        alternative_preference TEXT DEFAULT 'compatible_alternatives_acceptable',
        buyer_type TEXT DEFAULT 'individual',
        status TEXT DEFAULT 'active',
        is_demo INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 6. Demand Clusters
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demand_clusters (
        id TEXT PRIMARY KEY,
        cluster_name TEXT NOT NULL,
        category TEXT NOT NULL,
        target_product TEXT NOT NULL,
        total_quantity INTEGER DEFAULT 0,
        total_budget REAL DEFAULT 0.0,
        buyer_count INTEGER DEFAULT 0,
        geographic_focus TEXT DEFAULT 'Regional',
        demand_liquidity_score REAL DEFAULT 75.0,
        liquidity_factors TEXT, -- JSON
        growth_projection TEXT DEFAULT 'High (+25% in 7 days)',
        status TEXT DEFAULT 'forming',
        is_demo INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)

    # 7. Demand Matches
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS demand_matches (
        id TEXT PRIMARY KEY,
        cluster_id TEXT NOT NULL,
        demand_id TEXT NOT NULL,
        match_score REAL DEFAULT 90.0,
        compatibility_explanation TEXT NOT NULL,
        shared_specs TEXT, -- JSON
        differences TEXT, -- JSON
        potential_savings_pct REAL DEFAULT 18.5,
        approved_by_user INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY(cluster_id) REFERENCES demand_clusters(id) ON DELETE CASCADE,
        FOREIGN KEY(demand_id) REFERENCES demand_requests(id) ON DELETE CASCADE
    );
    """)

    # 8. Procurement Campaigns
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS procurement_campaigns (
        id TEXT PRIMARY KEY,
        cluster_id TEXT,
        title TEXT NOT NULL,
        product_name TEXT NOT NULL,
        category TEXT NOT NULL,
        target_quantity INTEGER NOT NULL,
        current_quantity INTEGER DEFAULT 0,
        min_required_quantity INTEGER NOT NULL,
        target_funding REAL DEFAULT 0.0,
        current_funding REAL DEFAULT 0.0,
        selected_quote_id TEXT,
        estimated_unit_price REAL NOT NULL,
        final_unit_price REAL,
        individual_market_unit_price REAL NOT NULL,
        status TEXT DEFAULT 'Discovering Demand',
        deadline TEXT NOT NULL,
        delivery_estimate TEXT DEFAULT '14-21 Business Days',
        is_demo INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)

    # 9. Supplier Quotes
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS supplier_quotes (
        id TEXT PRIMARY KEY,
        campaign_id TEXT,
        supplier_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        proposed_unit_price REAL NOT NULL,
        min_qty INTEGER DEFAULT 10,
        bulk_discount_pct REAL DEFAULT 0.0,
        delivery_fee REAL DEFAULT 0.0,
        tax_pct REAL DEFAULT 8.0,
        estimated_delivery_days INTEGER DEFAULT 7,
        status TEXT DEFAULT 'submitted',
        notes TEXT,
        is_demo INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY(supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    """)

    # 10. Campaign Participants
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campaign_participants (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        demand_id TEXT,
        quantity INTEGER NOT NULL,
        expected_contribution REAL NOT NULL,
        authorized_amount REAL DEFAULT 0.0,
        paid_amount REAL DEFAULT 0.0,
        refund_status TEXT DEFAULT 'NONE',
        approved INTEGER DEFAULT 1,
        joined_at TEXT NOT NULL,
        FOREIGN KEY(campaign_id) REFERENCES procurement_campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 11. Campaign Approvals
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campaign_approvals (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        approved INTEGER DEFAULT 1,
        approval_notes TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY(campaign_id) REFERENCES procurement_campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 12. Payment Transactions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payment_transactions (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        paypal_order_id TEXT UNIQUE NOT NULL,
        paypal_capture_id TEXT,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'CREATED',
        is_demo INTEGER DEFAULT 1,
        transaction_type TEXT DEFAULT 'CONTRIBUTION',
        payment_method TEXT DEFAULT 'PayPal Sandbox',
        created_at TEXT NOT NULL,
        FOREIGN KEY(campaign_id) REFERENCES procurement_campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 13. Financial Ledger
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS financial_ledger (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        user_id TEXT,
        entry_type TEXT NOT NULL,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        description TEXT NOT NULL,
        balance_after REAL DEFAULT 0.0,
        transaction_ref TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(campaign_id) REFERENCES procurement_campaigns(id) ON DELETE CASCADE
    );
    """)

    # 14. Procurement Orders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS procurement_orders (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        supplier_id TEXT NOT NULL,
        order_number TEXT UNIQUE NOT NULL,
        total_units INTEGER NOT NULL,
        total_cost REAL NOT NULL,
        supplier_payout REAL NOT NULL,
        platform_fee REAL DEFAULT 0.0,
        status TEXT DEFAULT 'Order Placed',
        tracking_code TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(campaign_id) REFERENCES procurement_campaigns(id) ON DELETE CASCADE,
        FOREIGN KEY(supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
    );
    """)

    # 15. Delivery Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS delivery_records (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        participant_id TEXT NOT NULL,
        address TEXT NOT NULL,
        carrier TEXT DEFAULT 'FedEx Ground Freight',
        tracking_number TEXT NOT NULL,
        status TEXT DEFAULT 'Preparing',
        estimated_arrival TEXT NOT NULL,
        last_location TEXT DEFAULT 'Central Distribution Hub, Chicago, IL',
        updated_at TEXT NOT NULL,
        FOREIGN KEY(order_id) REFERENCES procurement_orders(id) ON DELETE CASCADE,
        FOREIGN KEY(participant_id) REFERENCES campaign_participants(id) ON DELETE CASCADE
    );
    """)

    # 16. Agent Executions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_executions (
        id TEXT PRIMARY KEY,
        agent_name TEXT NOT NULL,
        input_summary TEXT NOT NULL,
        output_data TEXT, -- JSON
        execution_time_ms INTEGER DEFAULT 120,
        status TEXT DEFAULT 'completed',
        decision_explanation TEXT NOT NULL,
        related_entity_id TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # 17. Risk Assessments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS risk_assessments (
        id TEXT PRIMARY KEY,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        risk_score REAL DEFAULT 15.0,
        risk_level TEXT DEFAULT 'LOW',
        flags TEXT, -- JSON
        explanation TEXT NOT NULL,
        assessed_at TEXT NOT NULL
    );
    """)

    # 18. Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'INFO',
        read INTEGER DEFAULT 0,
        link TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 19. Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        ip_address TEXT DEFAULT '127.0.0.1',
        details TEXT, -- JSON
        timestamp TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    if row is None:
        return None
    d = dict(row)
    # Parse json fields automatically
    for key in ["specs", "bulk_tiers", "liquidity_factors", "shared_specs", "differences", "output_data", "flags", "details"]:
        if key in d and isinstance(d[key], str):
            try:
                d[key] = json.loads(d[key])
            except Exception:
                pass
    return d

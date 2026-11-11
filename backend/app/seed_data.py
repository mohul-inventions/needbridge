import uuid
import json
from datetime import datetime, timedelta
from app.db import init_db, get_connection
from app.auth import get_password_hash

def seed_database():
    init_db()
    conn = get_connection()

    # Check if already seeded
    cnt = conn.execute("SELECT COUNT(*) as c FROM users").fetchone()["c"]
    if cnt > 5:
        print("Database already contains seed data. Skipping re-seed.")
        conn.close()
        return

    print("Seeding database with realistic DEMO DATA via clean SQLite engine...")
    now = datetime.utcnow()
    now_str = now.isoformat()

    # 1. Admin User
    admin_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO users (id, email, password_hash, full_name, role, phone, address, is_active, created_at)
        VALUES (?, 'admin@needbridge.io', ?, 'Dr. Eleanor Vance (Platform Director)', 'admin', '+1-555-0199', '100 Tech Plaza, San Francisco, CA', 1, ?)
    """, (admin_id, get_password_hash("AdminPass123!"), now_str))

    # 2. 5 Organizations
    org_data = [
        ("Pacific Coast University", "University", "REG-PCU-2024", "Seattle, WA", "Premier public research university serving 28,000 undergraduates."),
        ("Apex Vocational Training Institute", "Training Institute", "REG-AVT-9811", "Denver, CO", "Specialized hardware networking and applied software development academy."),
        ("Oakridge STEM Academy", "High School", "REG-OSA-4412", "Austin, TX", "Charter secondary school emphasizing robotics, mathematics, and physics."),
        ("Community Coding Guild", "NGO / Community Org", "REG-CCG-7731", "Chicago, IL", "Non-profit providing subsidized technology education to underrepresented youth."),
        ("BioTech Discovery Labs", "Small Business / Incubator", "REG-BTD-3309", "Boston, MA", "Shared biotechnology laboratory workspace supporting 14 early-stage startups.")
    ]
    org_ids = []
    for name, otype, reg, loc, desc in org_data:
        oid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO organizations (id, name, type, registration_number, location, description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (oid, name, otype, reg, loc, desc, now_str))
        org_ids.append(oid)

    # 3. 20 Individual Buyers & Organization Buyers
    buyer_configs = [
        ("marcus.chen@pacific.edu", "Prof. Marcus Chen", "organization", org_ids[0]),
        ("sarah.jenkins@apextraining.org", "Sarah Jenkins (Procurement Lead)", "organization", org_ids[1]),
        ("david.rodriguez@oakridge.edu", "David Rodriguez (Lab Director)", "organization", org_ids[2]),
        ("amara.okafor@codingguild.org", "Amara Okafor (Director)", "organization", org_ids[3]),
        ("elena.rostova@biotechlabs.io", "Dr. Elena Rostova", "organization", org_ids[4]),
        ("maya.lin@student.org", "Maya Lin (CS Student)", "individual", None),
        ("liam.patel@makerhub.net", "Liam Patel (Hardware Maker)", "individual", None),
        ("chloe.bennett@freelance.dev", "Chloe Bennett (Full-Stack Dev)", "individual", None),
        ("ethan.hunt@edutech.io", "Ethan Hunt (STEM Tutor)", "individual", None),
        ("zoe.alvarez@bioexplorer.org", "Zoe Alvarez (Biology Researcher)", "individual", None),
        ("noah.kim@roboticsfan.net", "Noah Kim (High School Robotics Captain)", "individual", None),
        ("sophia.taylor@datacamp.org", "Sophia Taylor (Data Science Learner)", "individual", None),
        ("lucas.silva@studiospace.io", "Lucas Silva (Design Architect)", "individual", None),
        ("olivia.wright@greenenergy.org", "Olivia Wright (Clean Tech Lead)", "individual", None),
        ("mason.scott@repairlab.com", "Mason Scott (Electronics Hobbyist)", "individual", None),
        ("isabella.rossi@medstudent.org", "Isabella Rossi (Pre-Med Student)", "individual", None),
        ("james.wilson@craftworks.net", "James Wilson (Woodworking Collective)", "individual", None),
        ("ava.thompson@aerospaceclub.org", "Ava Thompson (Drone Systems Builder)", "individual", None),
        ("alexander.hall@communitycenter.org", "Alexander Hall (Library Coordinator)", "individual", None),
        ("emily.clark@stemkids.org", "Emily Clark (Parent Association Treasurer)", "individual", None)
    ]

    buyer_ids = []
    for email, name, role, org_id in buyer_configs:
        uid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO users (id, email, password_hash, full_name, role, phone, address, organization_id, is_active, created_at)
            VALUES (?, ?, ?, ?, ?, '+1-555-0100', '450 Regional Blvd, Metro Area', ?, 1, ?)
        """, (uid, email, get_password_hash("BuyerPass123!"), name, role, org_id, now_str))
        buyer_ids.append(uid)

    # 4. 8 Suppliers
    supplier_configs = [
        ("supplier.apex@apexcomputing.com", "Apex Enterprise Computing Ltd.", "Laptops & Computing", 4.9, "Austin, TX"),
        ("supplier.silicon@siliconlogistics.com", "Silicon Direct Wholesale Inc.", "Laptops & Computing", 4.7, "San Jose, CA"),
        ("supplier.scilab@scilaboratories.com", "SciLab Precision Optics & Equipment", "Lab & Scientific Equipment", 4.8, "Cambridge, MA"),
        ("supplier.stemkits@stemdirect.org", "EduStem Global Manufacturing", "Lab & Scientific Equipment", 4.6, "Chicago, IL"),
        ("supplier.ergon@ergonoffice.com", "Ergon Commercial Furnishings", "Office & Furniture", 4.7, "Grand Rapids, MI"),
        ("supplier.matrix@matrixdisplays.net", "Matrix Visual Technologies", "Electronics & Displays", 4.8, "Atlanta, GA"),
        ("supplier.volt@voltenergyparts.com", "VoltCore Industrial Components", "Clean Energy & Hardware", 4.5, "Phoenix, AZ"),
        ("supplier.prime@primebulklogistics.com", "PrimeSupply Wholesale Distro", "Office & Furniture", 4.6, "Dallas, TX")
    ]

    supplier_ids = []
    for email, biz_name, cat, rat, addr in supplier_configs:
        suid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO users (id, email, password_hash, full_name, role, phone, address, is_active, created_at)
            VALUES (?, ?, ?, ?, 'supplier', '+1-800-555-VEND', ?, 1, ?)
        """, (suid, email, get_password_hash("SupplierPass123!"), f"{biz_name} Rep", addr, now_str))

        sid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO suppliers (id, user_id, business_name, registration_no, category, rating, is_verified, address, contact_email, is_demo, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, 1, ?)
        """, (sid, suid, biz_name, f"CORP-TAX-{uuid.uuid4().hex[:6].upper()}", cat, rat, addr, email, now_str))
        supplier_ids.append(sid)

    # 5. Products
    product_configs = [
        (supplier_ids[0], "ThinkPad E14 Gen 5 (Intel Core i7, 16GB RAM, 512GB SSD)", "Laptops & Computing", "Enterprise MIL-SPEC tested laptop optimized for software engineering.", {"ram": "16GB DDR5", "storage": "512GB NVMe SSD", "processor": "Intel Core i7-1355U", "display": "14-inch FHD IPS", "warranty": "3 Years On-site"}, 890.0, 20, [{"min_qty": 30, "discount_pct": 10}, {"min_qty": 60, "discount_pct": 15}, {"min_qty": 100, "discount_pct": 20}], 10),
        (supplier_ids[1], "Dell Latitude 3440 (Intel Core i5, 16GB RAM, 512GB SSD)", "Laptops & Computing", "Workhorse education and developer laptop with durable unibody.", {"ram": "16GB DDR4", "storage": "512GB NVMe SSD", "processor": "Intel Core i5-1335U", "display": "14-inch FHD Anti-Glare", "warranty": "2 Years"}, 810.0, 15, [{"min_qty": 25, "discount_pct": 8}, {"min_qty": 50, "discount_pct": 14}, {"min_qty": 100, "discount_pct": 18}], 7),
        (supplier_ids[2], "Digital Trinocular STEM Microscope 1080P with 7-inch LCD Monitor", "Lab & Scientific Equipment", "Academic grade precision laboratory microscope.", {"magnification": "40X-2000X", "camera": "12MP Digital Sensor", "screen": "7-inch HD LCD"}, 340.0, 10, [{"min_qty": 20, "discount_pct": 12}, {"min_qty": 50, "discount_pct": 22}], 12),
        (supplier_ids[3], "Standard University Undergraduate Chemistry Experiment Lab Kit", "Lab & Scientific Equipment", "Standardized 45-piece borosilicate laboratory glassware and sensor module set.", {"glassware": "Borosilicate 3.3", "sensors": "Digital pH + Temp", "safety": "OSHA & CE Compliant"}, 165.0, 25, [{"min_qty": 50, "discount_pct": 15}, {"min_qty": 100, "discount_pct": 25}], 14),
        (supplier_ids[4], "Ergonomic Synchronous Mesh Task Chair with 3D Adjustable Arms", "Office & Furniture", "Commercial grade breathable task chair with dynamic lumbar slider.", {"mechanism": "Syncro-tilt", "mesh": "Elastomeric Mesh", "weight_capacity": "300 lbs"}, 240.0, 15, [{"min_qty": 30, "discount_pct": 15}, {"min_qty": 60, "discount_pct": 24}], 10)
    ]
    product_ids = []
    for sup_id, name, cat, desc, specs, price, moq, tiers, days in product_configs:
        pid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO products (id, supplier_id, name, category, description, specs, base_unit_price, min_order_qty, bulk_tiers, delivery_days_estimate, in_stock, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (pid, sup_id, name, cat, desc, json.dumps(specs), price, moq, json.dumps(tiers), days, now_str))
        product_ids.append(pid)

    # 6. 30 Demands
    demand_ids = []
    core_demands = [
        (buyer_ids[0], org_ids[0], "Need 40 Programming Laptops for CS Sophomore Cohort", "Laptops & Computing", "College of Engineering requires 40 durable laptops for upcoming Java/Python systems laboratory.", 40, 920.0, {"ram": "16GB", "storage": "512GB SSD", "processor": "Core i7"}, "Pacific Coast University, Dept of CS, Seattle, WA", "North America", "2026-12-20", "university", "campaign_created"),
        (buyer_ids[1], org_ids[1], "Looking for 35 Laptops for Computer Science Students", "Laptops & Computing", "35 units needed for vocational programming bootcamp. Must support Docker and Android Studio.", 35, 900.0, {"ram": "16GB", "storage": "512GB SSD", "processor": "Intel i5/i7"}, "Apex Training Center, 400 Tech Hub, Denver, CO", "North America", "2026-12-15", "training_center", "campaign_created"),
        (buyer_ids[3], org_ids[3], "25 Coding Laptops for Youth Tech Fellowship", "Laptops & Computing", "Subsidized community coding fellowship seeking 25 developer machines for underserved high school coders.", 25, 880.0, {"ram": "16GB", "storage": "512GB SSD", "processor": "i5/i7"}, "Community Guild HQ, 120 Michigan Ave, Chicago, IL", "North America", "2026-12-18", "community_org", "campaign_created"),
        (buyer_ids[2], org_ids[2], "50 Standard Chemistry Lab Kits for AP Science", "Lab & Scientific Equipment", "50 experiment kits with glassware and digital pH sensors for AP Chemistry labs.", 50, 175.0, {"glassware": "Borosilicate", "sensors": "Digital pH"}, "Oakridge STEM Academy, Austin, TX", "North America", "2026-12-30", "school", "campaign_created"),
        (buyer_ids[4], org_ids[4], "60 Laboratory Glassware Kits for Bio Incubator", "Lab & Scientific Equipment", "Standardized borosilicate glassware sets for shared biochemistry workstation prep.", 60, 180.0, {"glassware": "Borosilicate 3.3"}, "BioTech Incubator Bldg 4, Boston, MA", "North America", "2027-01-10", "small_business", "campaign_created")
    ]
    for uid, oid, name, cat, desc, qty, budget, specs, loc, reg, date, btype, stat in core_demands:
        did = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO demand_requests (
                id, user_id, organization_id, product_name, category, description, quantity,
                max_budget_per_unit, specs, delivery_location, delivery_region, required_delivery_date,
                alternative_preference, buyer_type, status, is_demo, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'compatible_alternatives_acceptable', ?, ?, 1, ?)
        """, (did, uid, oid, name, cat, desc, qty, budget, json.dumps(specs), loc, reg, date, btype, stat, now_str))
        demand_ids.append(did)

    # 25 more demands to reach 30
    sample_categories = [
        ("Laptops & Computing", "Individual Developer Laptop", 1, 950.0, "High-performance coding laptop for indie game dev."),
        ("Lab & Scientific Equipment", "Digital Microscope for Citizen Science Lab", 2, 350.0, "Microscope with HDMI out for community biology research."),
        ("Office & Furniture", "Ergonomic Task Chairs for Co-working Pod", 12, 250.0, "Breathable mesh ergonomic chairs for cooperative workspace."),
        ("Office & Furniture", "Ergonomic Task Chair for Remote Workstation", 1, 280.0, "Need 1 heavy duty ergonomic mesh chair with lumbar support."),
        ("Electronics & Displays", "27-inch 4K Color Accurate Monitors", 8, 380.0, "UHD IPS panels for design students portfolio work.")
    ]
    for idx, b_id in enumerate(buyer_ids[5:]):
        cat, title, qty, budget, desc = sample_categories[idx % len(sample_categories)]
        did = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO demand_requests (
                id, user_id, organization_id, product_name, category, description, quantity,
                max_budget_per_unit, specs, delivery_location, delivery_region, required_delivery_date,
                alternative_preference, buyer_type, status, is_demo, created_at
            ) VALUES (?, ?, NULL, ?, ?, ?, ?, ?, ?, 'Metro Region Delivery Point', 'North America', '2027-01-20', 'compatible_alternatives_acceptable', 'individual', 'active', 1, ?)
        """, (did, b_id, f"{title} (Requirement #{idx+6})", cat, desc, qty, budget, json.dumps({"tier": "Enterprise"}), now_str))
        demand_ids.append(did)

    # 7. 5 Clusters
    cluster_configs = [
        ("Collective Lot: STEM Developer Laptops (100 Units)", "Laptops & Computing", "ThinkPad E14 Gen 5 (Intel Core i7, 16GB RAM, 512GB SSD)", 100, 90400.0, 3, "North America (Regional Bulk Hub)", 87.5, {"buyer_density": 18.5, "volume_mass": 25.0, "supplier_availability": 14.5, "geographic_alignment": 13.5, "price_competitiveness": 12.0, "historical_success": 4.0}, "High (+35% in 7 days)", "campaign_active"),
        ("Academic Chemistry Borosilicate Lab Kits (110 Sets)", "Lab & Scientific Equipment", "Standard University Undergraduate Chemistry Experiment Lab Kit", 110, 19550.0, 2, "Eastern Seaboard & Midwest", 82.0, {"buyer_density": 16.0, "volume_mass": 24.0, "supplier_availability": 13.0, "geographic_alignment": 14.0, "price_competitiveness": 11.0, "historical_success": 4.0}, "Moderate (+18% in 14 days)", "campaign_active"),
        ("Ergonomic Synchronous Task Seating (45 Chairs)", "Office & Furniture", "Ergonomic Synchronous Mesh Task Chair with 3D Adjustable Arms", 45, 11250.0, 5, "Central Metro Co-working Zone", 68.5, {"buyer_density": 15.0, "volume_mass": 18.0, "supplier_availability": 12.0, "geographic_alignment": 11.0, "price_competitiveness": 9.0, "historical_success": 3.5}, "Developing (+20% in 10 days)", "ready_for_campaign"),
        ("Precision Trinocular STEM Microscopes (30 Units)", "Lab & Scientific Equipment", "Digital Trinocular STEM Microscope 1080P with 7-inch LCD Monitor", 30, 10500.0, 4, "National Academic Consortium", 64.0, {"buyer_density": 14.0, "volume_mass": 16.0, "supplier_availability": 11.0, "geographic_alignment": 10.0, "price_competitiveness": 9.5, "historical_success": 3.5}, "Developing (+12% in 14 days)", "forming"),
        ("Ultra-Wide 4K High-Res Design Displays (25 Units)", "Electronics & Displays", "27-inch 4K Color Accurate IPS Monitors", 25, 9500.0, 3, "West Coast Creative Guilds", 58.0, {"buyer_density": 12.0, "volume_mass": 14.0, "supplier_availability": 10.0, "geographic_alignment": 11.0, "price_competitiveness": 8.0, "historical_success": 3.0}, "Emerging (+15% in 21 days)", "forming")
    ]
    cluster_ids = []
    for cname, cat, tprod, tot_qty, tot_bud, bcnt, geo, score, facts, growth, stat in cluster_configs:
        cid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO demand_clusters (
                id, cluster_name, category, target_product, total_quantity, total_budget,
                buyer_count, geographic_focus, demand_liquidity_score, liquidity_factors,
                growth_projection, status, is_demo, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (cid, cname, cat, tprod, tot_qty, tot_bud, bcnt, geo, score, json.dumps(facts), growth, stat, now_str))
        cluster_ids.append(cid)

    # Matches for Cluster 0
    match_pairs = [
        (cluster_ids[0], demand_ids[0], 94.5, "Shared core specs: 16GB RAM, 512GB SSD, Intel i7, North America delivery.", ["16GB RAM", "512GB NVMe SSD", "i7 Processor"], ["Minor OS preference"]),
        (cluster_ids[0], demand_ids[1], 92.0, "Compatible hardware footprint: 16GB RAM, 512GB SSD with 2-year warranty.", ["16GB RAM", "512GB SSD", "2-Year Hardware SLA"], ["Delivery window varies 5 days"]),
        (cluster_ids[0], demand_ids[2], 89.5, "Compatible developer class machines. Non-profit model qualifies for bulk tier.", ["16GB RAM", "512GB SSD"], ["Tax-exempt non-profit invoicing"])
    ]
    for cid, did, mscore, expl, shared, diffs in match_pairs:
        mid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO demand_matches (
                id, cluster_id, demand_id, match_score, compatibility_explanation, shared_specs, differences, potential_savings_pct, approved_by_user, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 18.5, 1, ?)
        """, (mid, cid, did, mscore, expl, json.dumps(shared), json.dumps(diffs), now_str))

    # 8. 4 Campaigns
    campaign_configs = [
        (cluster_ids[0], "Cross-Community STEM Laptop Collective Procurement", "ThinkPad E14 Gen 5 (Intel Core i7, 16GB RAM, 512GB SSD)", "Laptops & Computing", 100, 100, 80, 76000.0, 76000.0, 712.0, 712.0, 890.0, "Purchased", "2026-12-10", "10-14 Business Days"),
        (cluster_ids[1], "Consortium Undergraduate Chemistry Experiment Sets", "Standard University Undergraduate Chemistry Experiment Lab Kit", "Lab & Scientific Equipment", 110, 110, 90, 13612.5, 13612.5, 123.75, 123.75, 165.0, "Threshold Achieved", "2026-12-28", "14-21 Business Days"),
        (cluster_ids[2], "Regional Co-working & Studio Ergonomic Task Seating", "Ergonomic Synchronous Mesh Task Chair with 3D Adjustable Arms", "Office & Furniture", 45, 35, 30, 8208.0, 6384.0, 182.4, None, 240.0, "Funding Pending", "2027-01-15", "7-12 Business Days"),
        (cluster_ids[3], "Undergraduate Biology Digital Microscope Batch", "Digital Trinocular STEM Microscope 1080P with 7-inch LCD Monitor", "Lab & Scientific Equipment", 30, 18, 20, 7956.0, 4773.6, 265.2, None, 340.0, "Proposal Ready", "2027-01-30", "12-16 Business Days")
    ]
    campaign_ids = []
    for cid, title, prod, cat, t_qty, c_qty, m_qty, t_fund, c_fund, e_price, f_price, m_price, stat, dline, deliv in campaign_configs:
        camp_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO procurement_campaigns (
                id, cluster_id, title, product_name, category, target_quantity, current_quantity,
                min_required_quantity, target_funding, current_funding, estimated_unit_price,
                final_unit_price, individual_market_unit_price, status, deadline, delivery_estimate, is_demo, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (camp_id, cid, title, prod, cat, t_qty, c_qty, m_qty, t_fund, c_fund, e_price, f_price, m_price, stat, dline, deliv, now_str))
        campaign_ids.append(camp_id)

    # 9. Quotes
    quote_configs = [
        (campaign_ids[0], supplier_ids[0], product_ids[0], 712.0, 60, 20.0, 250.0, 8.0, 10, "selected", "Factory direct batch reservation confirmed. Includes 3-year premier warranty."),
        (campaign_ids[0], supplier_ids[1], product_ids[1], 729.0, 50, 10.0, 300.0, 8.0, 12, "submitted", "Alternative Dell Latitude batch with identical port matrix and SSD encryption."),
        (campaign_ids[1], supplier_ids[3], product_ids[3], 123.75, 80, 25.0, 180.0, 8.0, 14, "selected", "Direct manufacturer glassware shipment in anti-shock pallets.")
    ]
    quote_ids = []
    for cmp_id, sup_id, prd_id, price, moq, disc, fee, tax, days, stat, notes in quote_configs:
        qid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO supplier_quotes (
                id, campaign_id, supplier_id, product_id, proposed_unit_price, min_qty,
                bulk_discount_pct, delivery_fee, tax_pct, estimated_delivery_days, status, notes, is_demo, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (qid, cmp_id, sup_id, prd_id, price, moq, disc, fee, tax, days, stat, notes, now_str))
        quote_ids.append(qid)

    # 10. Participants for Campaign 0
    part_configs = [
        (campaign_ids[0], buyer_ids[0], demand_ids[0], 40, 28480.0, 28480.0, 28480.0),
        (campaign_ids[0], buyer_ids[1], demand_ids[1], 35, 24920.0, 24920.0, 24920.0),
        (campaign_ids[0], buyer_ids[3], demand_ids[2], 25, 17800.0, 17800.0, 17800.0)
    ]
    participant_ids = []
    for cmp_id, uid, did, qty, exp, auth, paid in part_configs:
        prt_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO campaign_participants (
                id, campaign_id, user_id, demand_id, quantity, expected_contribution,
                authorized_amount, paid_amount, refund_status, approved, joined_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'NONE', 1, ?)
        """, (prt_id, cmp_id, uid, did, qty, exp, auth, paid, now_str))
        participant_ids.append(prt_id)

        # Approval
        app_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO campaign_approvals (id, campaign_id, user_id, approved, approval_notes, timestamp)
            VALUES (?, ?, ?, 1, 'Approved bulk supplier quotation from Apex Enterprise Computing.', ?)
        """, (app_id, cmp_id, uid, now_str))

    # 11. Payments for Campaign 0 (PayPal Sandbox)
    tx_configs = [
        (campaign_ids[0], buyer_ids[0], "PAYPAL-SANDBOX-PCU-7721", "CAPTURE-PCU-4410", 28480.0),
        (campaign_ids[0], buyer_ids[1], "PAYPAL-SANDBOX-AVT-9921", "CAPTURE-AVT-3390", 24920.0),
        (campaign_ids[0], buyer_ids[3], "PAYPAL-SANDBOX-CCG-1102", "CAPTURE-CCG-8812", 17800.0)
    ]
    for cmp_id, uid, p_order, p_cap, amt in tx_configs:
        tx_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO payment_transactions (
                id, campaign_id, user_id, paypal_order_id, paypal_capture_id, amount, currency,
                status, is_demo, transaction_type, payment_method, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'USD', 'COMPLETED', 1, 'CONTRIBUTION', 'PayPal Sandbox Escrow', ?)
        """, (tx_id, cmp_id, uid, p_order, p_cap, amt, now_str))

    # 12. Financial Ledger
    ledger_configs = [
        (campaign_ids[0], buyer_ids[0], "ESCROW_HOLD", 28480.0, "PayPal Sandbox Escrow Deposit from Pacific Coast University (40 units)", 28480.0, "CAPTURE-PCU-4410"),
        (campaign_ids[0], buyer_ids[1], "ESCROW_HOLD", 24920.0, "PayPal Sandbox Escrow Deposit from Apex Vocational Training (35 units)", 53400.0, "CAPTURE-AVT-3390"),
        (campaign_ids[0], buyer_ids[3], "ESCROW_HOLD", 17800.0, "PayPal Sandbox Escrow Deposit from Community Coding Guild (25 units)", 71200.0, "CAPTURE-CCG-8812"),
        (campaign_ids[0], None, "SUPPLIER_PAYOUT", -71200.0, "Authorized Bulk Procurement Payout to Apex Enterprise Computing Ltd. (Order #NB-ORD-9021)", 0.0, "PAYOUT-APEX-9021")
    ]
    for cmp_id, uid, etype, amt, desc, bal, tx_ref in ledger_configs:
        lid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO financial_ledger (id, campaign_id, user_id, entry_type, amount, currency, description, balance_after, transaction_ref, created_at)
            VALUES (?, ?, ?, ?, ?, 'USD', ?, ?, ?, ?)
        """, (lid, cmp_id, uid, etype, amt, desc, bal, tx_ref, now_str))

    # 13. Procurement Order and Deliveries
    order_id = str(uuid.uuid4())
    conn.execute("""
        INSERT INTO procurement_orders (
            id, campaign_id, supplier_id, order_number, total_units, total_cost, supplier_payout,
            platform_fee, status, tracking_code, created_at
        ) VALUES (?, ?, ?, 'NB-ORD-9021', 100, 71200.0, 71200.0, 0.0, 'Dispatched', 'FEDEX-FREIGHT-991209', ?)
    """, (order_id, campaign_ids[0], supplier_ids[0], now_str))

    deliv_configs = [
        (order_id, participant_ids[0], "Pacific Coast University, 400 University Way, Seattle, WA", "FEDEX-SEA-4019", "In Transit", "2026-12-14", "Regional Distribution Hub, Portland, OR"),
        (order_id, participant_ids[1], "Apex Training Center, 400 Tech Hub, Denver, CO", "FEDEX-DEN-3312", "In Transit", "2026-12-13", "Central Freight Hub, Salt Lake City, UT"),
        (order_id, participant_ids[2], "Community Guild HQ, 120 Michigan Ave, Chicago, IL", "FEDEX-CHI-8821", "In Transit", "2026-12-14", "Midwest Transfer Facility, Des Moines, IA")
    ]
    for oid, pid, addr, trk, stat, est, loc in deliv_configs:
        del_id = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO delivery_records (
                id, order_id, participant_id, address, carrier, tracking_number, status, estimated_arrival, last_location, updated_at
            ) VALUES (?, ?, ?, ?, 'FedEx Ground Freight', ?, ?, ?, ?, ?)
        """, (del_id, oid, pid, addr, trk, stat, est, loc, now_str))

    # 14. Agent Execution History Logs for the Timeline
    agent_logs = [
        ("Demand Intelligence Agent", "Parsed unstructured requisition: Need 40 programming laptops for computer science cohort.", {"category": "Laptops & Computing", "specs": {"ram": "16GB", "storage": "512GB SSD", "cpu": "Core i7"}, "clarity": 95}, 88, "completed", "Extracted 4 technical attributes with 95% confidence. Standardized category to Laptops & Computing.", demand_ids[0], (now - timedelta(minutes=15)).isoformat()),
        ("Community Discovery Agent", "Cross-community affinity search for developer laptops across 30 active requirements.", {"cluster_size": 3, "total_quantity": 100, "liquidity_score": 87.5}, 145, "completed", "Discovered 3 compatible requirements: Pacific Coast Univ (40), Apex Training (35), Community Coding Guild (25). Aggregated 100 units.", cluster_ids[0], (now - timedelta(minutes=14)).isoformat()),
        ("Procurement Optimization Agent", "Evaluated supplier quotations from Apex Enterprise Computing vs Silicon Direct Wholesale.", {"selected_supplier": "Apex Enterprise Computing", "unit_price": 712.0, "discount": "20%", "composite_score": 93.4}, 112, "completed", "Selected Apex Enterprise Computing (Total Value Score 93.4/100). Bulk price $712.00 vs $890.00 retail baseline.", campaign_ids[0], (now - timedelta(minutes=12)).isoformat()),
        ("Alternative Product Agent", "Verified technical specification parity between ThinkPad E14 and Dell Latitude 3440.", {"compatibility_pct": 96.0, "advantages": ["Chassis durability", "Battery longevity"], "buyer_approval_mandatory": True}, 94, "completed", "Specification parity verified at 96% compatibility. Flagged mandatory buyer approval check.", campaign_ids[0], (now - timedelta(minutes=11)).isoformat()),
        ("Financial Intelligence Agent", "Calculated individual vs collective cost baseline and participant ledger allocations for 100 laptops.", {"individual_cost": 89000.0, "collective_cost": 71200.0, "total_savings": 17800.0, "savings_pct": 20.0}, 130, "completed", "Total collective savings calculated at $17,800.00 (20.0% reduction). Pro-rated allocations assigned.", campaign_ids[0], (now - timedelta(minutes=9)).isoformat()),
        ("Risk & Trust Agent", "Integrity and anti-dumping audit on Apex Enterprise quote ($712/unit) and corporate registration.", {"risk_score": 12.0, "risk_level": "LOW", "flags": ["Verified corporate registration", "Price spread within 20% norm"]}, 105, "completed", "Risk audit passed with score 12/100 (LOW RISK). Approved for automated escrow clearing.", campaign_ids[0], (now - timedelta(minutes=8)).isoformat()),
        ("Procurement Coordinator Agent", "Validated campaign execution readiness: 100/80 MOQ threshold met, 3/3 buyer approvals, escrow fully funded.", {"is_ready": True, "recommended_status": "Threshold Achieved -> Purchased"}, 125, "completed", "Consensus verified (100% buyer approval). Escrow balance $71,200.00 confirmed. Recommended immediate contract execution.", campaign_ids[0], (now - timedelta(minutes=7)).isoformat())
    ]
    for aname, in_sum, out_d, ems, stat, expl, rel_id, ctime in agent_logs:
        aid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO agent_executions (
                id, agent_name, input_summary, output_data, execution_time_ms, status, decision_explanation, related_entity_id, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (aid, aname, in_sum, json.dumps(out_d), ems, stat, expl, rel_id, ctime))

    # 15. Risk Assessments
    risk_records = [
        ("supplier", supplier_ids[0], 12.0, "LOW", ["Verified enterprise business registration", "Historical fulfillment rating 4.9/5", "Price variance within normal margin"], "Supplier has authenticated corporate standing and consistent on-time delivery track record across 14 quarters.", (now - timedelta(hours=2)).isoformat()),
        ("campaign", campaign_ids[0], 8.5, "LOW", ["Full buyer authorization recorded", "100% escrow funded", "Zero duplicate user accounts detected"], "Campaign satisfies all fraud-prevention criteria with 3 independent verified institutions.", (now - timedelta(hours=1)).isoformat())
    ]
    for ttype, tid, rscore, rlvl, flags, expl, atime in risk_records:
        rid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO risk_assessments (id, target_type, target_id, risk_score, risk_level, flags, explanation, assessed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (rid, ttype, tid, rscore, rlvl, json.dumps(flags), expl, atime))

    # 16. Notifications
    notif_configs = [
        (buyer_ids[0], "Demand Cluster Formed", "Your requirement for 40 laptops has been matched with 2 independent institutions (Total: 100 units, 20% estimated savings).", "SUCCESS", "/campaigns"),
        (buyer_ids[1], "Campaign Proposal Ready for Approval", "Apex Enterprise Computing submitted a winning bulk quotation. Please review and approve your participation.", "ACTION_REQUIRED", "/campaigns")
    ]
    for uid, title, msg, ntype, lnk in notif_configs:
        nid = str(uuid.uuid4())
        conn.execute("""
            INSERT INTO notifications (id, user_id, title, message, type, read, link, created_at)
            VALUES (?, ?, ?, ?, ?, 0, ?, ?)
        """, (nid, uid, title, msg, ntype, lnk, now_str))

    conn.commit()
    conn.close()
    print("Seed complete! 20 buyers, 5 orgs, 8 suppliers, 30 demands, 5 clusters, 4 campaigns created cleanly.")

if __name__ == "__main__":
    seed_database()

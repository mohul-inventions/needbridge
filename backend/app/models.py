from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="individual")  # individual, organization, supplier, admin
    phone = Column(String(50), nullable=True)
    address = Column(String(255), nullable=True)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="members")
    supplier_profile = relationship("Supplier", back_populates="user", uselist=False)
    demands = relationship("DemandRequest", back_populates="user")
    campaign_participations = relationship("CampaignParticipant", back_populates="user")
    payments = relationship("PaymentTransaction", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    type = Column(String(100), default="Educational Institution")  # University, High School, NGO, Research Lab, Small Business
    registration_number = Column(String(100), nullable=True)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("User", back_populates="organization")
    demands = relationship("DemandRequest", back_populates="organization")

class OrganizationMember(Base):
    __tablename__ = "organization_members"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    member_role = Column(String(50), default="member")  # admin, manager, member
    joined_at = Column(DateTime, default=datetime.utcnow)

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    business_name = Column(String(255), nullable=False)
    registration_no = Column(String(100), nullable=True)
    category = Column(String(100), nullable=False)  # Electronics, Lab Equipment, IT Hardware, Educational, Office
    rating = Column(Float, default=4.8)
    is_verified = Column(Boolean, default=True)
    address = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="supplier_profile")
    products = relationship("Product", back_populates="supplier")
    quotes = relationship("SupplierQuote", back_populates="supplier")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    supplier_id = Column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    specs = Column(JSON, default=dict)  # {"ram": "16GB", "cpu": "i7", "warranty": "2 years"}
    base_unit_price = Column(Float, nullable=False)
    min_order_qty = Column(Integer, default=1)
    bulk_tiers = Column(JSON, default=list)  # [{"min_qty": 20, "discount_pct": 10}, {"min_qty": 50, "discount_pct": 18}]
    delivery_days_estimate = Column(Integer, default=7)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="products")
    quotes = relationship("SupplierQuote", back_populates="product")

class DemandRequest(Base):
    __tablename__ = "demand_requests"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False)
    max_budget_per_unit = Column(Float, nullable=False)
    specs = Column(JSON, default=dict)
    delivery_location = Column(String(255), nullable=False)
    delivery_region = Column(String(100), default="North America")
    required_delivery_date = Column(String(50), nullable=False)
    alternative_preference = Column(String(50), default="compatible_alternatives_acceptable")  # exact_only, compatible_alternatives_acceptable
    buyer_type = Column(String(50), default="individual")  # individual, university, school, training_center, small_business
    status = Column(String(50), default="active")  # active, matched, campaign_created, fulfilled, cancelled
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="demands")
    organization = relationship("Organization", back_populates="demands")
    attributes = relationship("DemandAttribute", back_populates="demand", cascade="all, delete-orphan")
    matches = relationship("DemandMatch", back_populates="demand")

class DemandAttribute(Base):
    __tablename__ = "demand_attributes"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    demand_id = Column(String(36), ForeignKey("demand_requests.id", ondelete="CASCADE"), nullable=False)
    attribute_key = Column(String(100), nullable=False)
    attribute_val = Column(String(255), nullable=False)
    is_required = Column(Boolean, default=True)

    demand = relationship("DemandRequest", back_populates="attributes")

class DemandCluster(Base):
    __tablename__ = "demand_clusters"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    target_product = Column(String(255), nullable=False)
    total_quantity = Column(Integer, default=0)
    total_budget = Column(Float, default=0.0)
    buyer_count = Column(Integer, default=0)
    geographic_focus = Column(String(100), default="Regional")
    demand_liquidity_score = Column(Float, default=75.0)  # 0 to 100
    liquidity_factors = Column(JSON, default=dict)
    growth_projection = Column(String(100), default="High (+25% in 7 days)")
    status = Column(String(50), default="forming")  # forming, ready_for_campaign, campaign_active, closed
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    matches = relationship("DemandMatch", back_populates="cluster")
    campaigns = relationship("ProcurementCampaign", back_populates="cluster")

class DemandMatch(Base):
    __tablename__ = "demand_matches"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(36), ForeignKey("demand_clusters.id", ondelete="CASCADE"), nullable=False)
    demand_id = Column(String(36), ForeignKey("demand_requests.id", ondelete="CASCADE"), nullable=False)
    match_score = Column(Float, default=90.0)  # 0 to 100%
    compatibility_explanation = Column(Text, nullable=False)
    shared_specs = Column(JSON, default=list)
    differences = Column(JSON, default=list)
    potential_savings_pct = Column(Float, default=18.5)
    approved_by_user = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    cluster = relationship("DemandCluster", back_populates="matches")
    demand = relationship("DemandRequest", back_populates="matches")

class SupplierQuote(Base):
    __tablename__ = "supplier_quotes"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("procurement_campaigns.id", ondelete="SET NULL"), nullable=True)
    supplier_id = Column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    proposed_unit_price = Column(Float, nullable=False)
    min_qty = Column(Integer, default=10)
    bulk_discount_pct = Column(Float, default=0.0)
    delivery_fee = Column(Float, default=0.0)
    tax_pct = Column(Float, default=8.0)
    estimated_delivery_days = Column(Integer, default=7)
    status = Column(String(50), default="submitted")  # submitted, under_review, selected, rejected
    notes = Column(Text, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="quotes")
    product = relationship("Product", back_populates="quotes")
    campaign = relationship("ProcurementCampaign", back_populates="quotes", foreign_keys=[campaign_id])

class ProcurementCampaign(Base):
    __tablename__ = "procurement_campaigns"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(36), ForeignKey("demand_clusters.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    target_quantity = Column(Integer, nullable=False)
    current_quantity = Column(Integer, default=0)
    min_required_quantity = Column(Integer, nullable=False)
    target_funding = Column(Float, default=0.0)
    current_funding = Column(Float, default=0.0)
    selected_quote_id = Column(String(36), nullable=True)
    estimated_unit_price = Column(Float, nullable=False)
    final_unit_price = Column(Float, nullable=True)
    individual_market_unit_price = Column(Float, nullable=False)  # comparison price if bought alone
    status = Column(String(50), default="Discovering Demand")
    # Statuses: 'Discovering Demand', 'Awaiting Supplier Quotes', 'Proposal Ready',
    # 'Awaiting Buyer Approval', 'Funding Pending', 'Threshold Achieved',
    # 'Procurement Processing', 'Purchased', 'Delivered', 'Cancelled', 'Refunded'
    deadline = Column(String(50), nullable=False)
    delivery_estimate = Column(String(100), default="14-21 Business Days")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    cluster = relationship("DemandCluster", back_populates="campaigns")
    quotes = relationship("SupplierQuote", back_populates="campaign", foreign_keys=[SupplierQuote.campaign_id])
    participants = relationship("CampaignParticipant", back_populates="campaign")
    approvals = relationship("CampaignApproval", back_populates="campaign")
    orders = relationship("ProcurementOrder", back_populates="campaign")
    ledger_entries = relationship("FinancialLedger", back_populates="campaign")

class CampaignParticipant(Base):
    __tablename__ = "campaign_participants"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("procurement_campaigns.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    demand_id = Column(String(36), ForeignKey("demand_requests.id", ondelete="SET NULL"), nullable=True)
    quantity = Column(Integer, nullable=False)
    expected_contribution = Column(Float, nullable=False)
    authorized_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    refund_status = Column(String(50), default="NONE")  # NONE, REQUESTED, PROCESSED
    approved = Column(Boolean, default=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("ProcurementCampaign", back_populates="participants")
    user = relationship("User", back_populates="campaign_participations")
    delivery_record = relationship("DeliveryRecord", back_populates="participant", uselist=False)

class CampaignApproval(Base):
    __tablename__ = "campaign_approvals"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("procurement_campaigns.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    approved = Column(Boolean, default=True)
    approval_notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("ProcurementCampaign", back_populates="approvals")

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("procurement_campaigns.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    paypal_order_id = Column(String(100), unique=True, nullable=False)
    paypal_capture_id = Column(String(100), nullable=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="CREATED")  # CREATED, AUTHORIZED, COMPLETED, REFUNDED, FAILED
    is_demo = Column(Boolean, default=True)
    transaction_type = Column(String(50), default="CONTRIBUTION")  # CONTRIBUTION, ESCROW_HOLD, REFUND, PAYOUT
    payment_method = Column(String(50), default="PayPal Sandbox")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="payments")

class FinancialLedger(Base):
    __tablename__ = "financial_ledger"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("procurement_campaigns.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    entry_type = Column(String(50), nullable=False)  # BUYER_DEPOSIT, ESCROW_HOLD, SUPPLIER_PAYMENT, PLATFORM_FEE, REFUND, SAVINGS_CREDIT
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    description = Column(String(255), nullable=False)
    balance_after = Column(Float, default=0.0)
    transaction_ref = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("ProcurementCampaign", back_populates="ledger_entries")

class ProcurementOrder(Base):
    __tablename__ = "procurement_orders"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    campaign_id = Column(String(36), ForeignKey("procurement_campaigns.id", ondelete="CASCADE"), nullable=False)
    supplier_id = Column(String(36), ForeignKey("suppliers.id", ondelete="CASCADE"), nullable=False)
    order_number = Column(String(50), unique=True, nullable=False)
    total_units = Column(Integer, nullable=False)
    total_cost = Column(Float, nullable=False)
    supplier_payout = Column(Float, nullable=False)
    platform_fee = Column(Float, default=0.0)
    status = Column(String(50), default="Order Placed")  # Order Placed, Supplier Confirmed, In Manufacturing, Dispatched, Delivered
    tracking_code = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("ProcurementCampaign", back_populates="orders")
    deliveries = relationship("DeliveryRecord", back_populates="order")

class DeliveryRecord(Base):
    __tablename__ = "delivery_records"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("procurement_orders.id", ondelete="CASCADE"), nullable=False)
    participant_id = Column(String(36), ForeignKey("campaign_participants.id", ondelete="CASCADE"), nullable=False)
    address = Column(String(255), nullable=False)
    carrier = Column(String(100), default="FedEx Ground Freight")
    tracking_number = Column(String(100), nullable=False)
    status = Column(String(50), default="Preparing")  # Preparing, Shipped, In Transit, Out for Delivery, Delivered
    estimated_arrival = Column(String(50), nullable=False)
    last_location = Column(String(255), default="Central Distribution Hub, Chicago, IL")
    updated_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("ProcurementOrder", back_populates="deliveries")
    participant = relationship("CampaignParticipant", back_populates="delivery_record")

class AgentExecution(Base):
    __tablename__ = "agent_executions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    agent_name = Column(String(100), nullable=False)
    # Demand Intelligence Agent, Community Discovery Agent, Procurement Optimization Agent,
    # Alternative Product Agent, Financial Intelligence Agent, Risk & Trust Agent, Procurement Coordinator Agent
    input_summary = Column(Text, nullable=False)
    output_data = Column(JSON, default=dict)
    execution_time_ms = Column(Integer, default=120)
    status = Column(String(50), default="completed")  # running, completed, failed
    decision_explanation = Column(Text, nullable=False)
    related_entity_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    target_type = Column(String(50), nullable=False)  # supplier, campaign, quote, cluster
    target_id = Column(String(36), nullable=False)
    risk_score = Column(Float, default=15.0)  # 0 to 100 (lower is safer)
    risk_level = Column(String(50), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    flags = Column(JSON, default=list)  # ["Price deviation < 5%", "Verified supplier badge"]
    explanation = Column(Text, nullable=False)
    assessed_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # INFO, SUCCESS, WARNING, ACTION_REQUIRED
    read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)

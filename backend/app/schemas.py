from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "individual"  # individual, organization, supplier, admin
    phone: Optional[str] = None
    address: Optional[str] = None
    organization_id: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- Demand Request Schemas ---
class DemandRequestCreate(BaseModel):
    product_name: str
    category: str
    description: str
    quantity: int = Field(gt=0)
    max_budget_per_unit: float = Field(gt=0)
    specs: Dict[str, Any] = Field(default_factory=dict)
    delivery_location: str
    delivery_region: str = "North America"
    required_delivery_date: str
    alternative_preference: str = "compatible_alternatives_acceptable"
    buyer_type: str = "individual"

class DemandRequestResponse(DemandRequestCreate):
    id: str
    user_id: str
    organization_id: Optional[str] = None
    status: str
    is_demo: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Cluster & Match Schemas ---
class DemandMatchResponse(BaseModel):
    id: str
    cluster_id: str
    demand_id: str
    match_score: float
    compatibility_explanation: str
    shared_specs: List[str]
    differences: List[str]
    potential_savings_pct: float
    approved_by_user: bool
    created_at: datetime

    class Config:
        from_attributes = True

class DemandClusterResponse(BaseModel):
    id: str
    cluster_name: str
    category: str
    target_product: str
    total_quantity: int
    total_budget: float
    buyer_count: int
    geographic_focus: str
    demand_liquidity_score: float
    liquidity_factors: Dict[str, Any]
    growth_projection: str
    status: str
    is_demo: bool
    created_at: datetime
    matches: Optional[List[DemandMatchResponse]] = []

    class Config:
        from_attributes = True

# --- Supplier & Product Schemas ---
class ProductCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    specs: Dict[str, Any] = Field(default_factory=dict)
    base_unit_price: float
    min_order_qty: int = 1
    bulk_tiers: List[Dict[str, Any]] = Field(default_factory=list)
    delivery_days_estimate: int = 7

class ProductResponse(ProductCreate):
    id: str
    supplier_id: str
    in_stock: bool
    created_at: datetime

    class Config:
        from_attributes = True

class SupplierQuoteCreate(BaseModel):
    campaign_id: Optional[str] = None
    product_id: str
    proposed_unit_price: float
    min_qty: int = 10
    bulk_discount_pct: float = 0.0
    delivery_fee: float = 0.0
    tax_pct: float = 8.0
    estimated_delivery_days: int = 7
    notes: Optional[str] = None

class SupplierQuoteResponse(BaseModel):
    id: str
    campaign_id: Optional[str]
    supplier_id: str
    product_id: str
    proposed_unit_price: float
    min_qty: int
    bulk_discount_pct: float
    delivery_fee: float
    tax_pct: float
    estimated_delivery_days: int
    status: str
    notes: Optional[str]
    is_demo: bool
    created_at: datetime
    supplier_name: Optional[str] = None
    product_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- Campaign Schemas ---
class CampaignJoinRequest(BaseModel):
    quantity: int = Field(gt=0)
    demand_id: Optional[str] = None

class CampaignApprovalRequest(BaseModel):
    approved: bool
    notes: Optional[str] = None

class CampaignParticipantResponse(BaseModel):
    id: str
    campaign_id: str
    user_id: str
    quantity: int
    expected_contribution: float
    authorized_amount: float
    paid_amount: float
    refund_status: str
    approved: bool
    joined_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True

class CampaignResponse(BaseModel):
    id: str
    cluster_id: Optional[str]
    title: str
    product_name: str
    category: str
    target_quantity: int
    current_quantity: int
    min_required_quantity: int
    target_funding: float
    current_funding: float
    estimated_unit_price: float
    final_unit_price: Optional[float]
    individual_market_unit_price: float
    status: str
    deadline: str
    delivery_estimate: str
    is_demo: bool
    created_at: datetime
    participants_count: Optional[int] = 0
    participants: Optional[List[CampaignParticipantResponse]] = []
    quotes: Optional[List[SupplierQuoteResponse]] = []

    class Config:
        from_attributes = True

# --- Financial & Payment Schemas ---
class PayPalOrderCreate(BaseModel):
    campaign_id: str
    quantity: int

class PayPalOrderResponse(BaseModel):
    order_id: str
    approval_url: str
    status: str
    amount: float
    currency: str

class PayPalCaptureRequest(BaseModel):
    order_id: str
    campaign_id: str

class LedgerEntryResponse(BaseModel):
    id: str
    campaign_id: str
    user_id: Optional[str]
    entry_type: str
    amount: float
    currency: str
    description: str
    balance_after: float
    transaction_ref: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI & Agent Schemas ---
class AgentExecutionResponse(BaseModel):
    id: str
    agent_name: str
    input_summary: str
    output_data: Dict[str, Any]
    execution_time_ms: int
    status: str
    decision_explanation: str
    related_entity_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class RiskAssessmentResponse(BaseModel):
    id: str
    target_type: str
    target_id: str
    risk_score: float
    risk_level: str
    flags: List[str]
    explanation: str
    assessed_at: datetime

    class Config:
        from_attributes = True

class PredictiveDemandItem(BaseModel):
    category: str
    predicted_item: str
    expected_quantity_range: str
    historical_demand_frequency: str
    confidence_level: float
    confidence_label: str
    recommended_preparation_date: str
    explanation: str
    is_heuristic: bool

class DemandAnalysisResult(BaseModel):
    product_name: str
    category: str
    extracted_specs: Dict[str, Any]
    sentiment_and_clarity: str
    recommended_alternatives: List[Dict[str, Any]]
    suggested_cluster_id: Optional[str]
    compatible_demands_count: int
    estimated_collective_savings_pct: float
    liquidity_score_forecast: float

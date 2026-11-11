export type UserRole = 'individual' | 'organization' | 'supplier' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  organization_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface DemandRequest {
  id: string;
  user_id: string;
  organization_id?: string;
  product_name: string;
  category: string;
  description: string;
  quantity: number;
  max_budget_per_unit: number;
  specs: Record<string, any>;
  delivery_location: string;
  delivery_region: string;
  required_delivery_date: string;
  alternative_preference: string;
  buyer_type: string;
  status: string;
  is_demo: boolean;
  created_at: string;
}

export interface DemandMatch {
  id: string;
  cluster_id: string;
  demand_id: string;
  match_score: number;
  compatibility_explanation: string;
  shared_specs: string[];
  differences: string[];
  potential_savings_pct: number;
  approved_by_user: boolean;
  created_at: string;
}

export interface DemandCluster {
  id: string;
  cluster_name: string;
  category: string;
  target_product: string;
  total_quantity: number;
  total_budget: number;
  buyer_count: number;
  geographic_focus: string;
  demand_liquidity_score: number;
  liquidity_factors: {
    buyer_density: number;
    volume_mass: number;
    supplier_availability: number;
    geographic_alignment: number;
    price_competitiveness: number;
    historical_success: number;
  };
  growth_projection: string;
  status: string;
  is_demo: boolean;
  created_at: string;
  matches?: DemandMatch[];
}

export interface SupplierQuote {
  id: string;
  campaign_id?: string;
  supplier_id: string;
  product_id: string;
  proposed_unit_price: number;
  min_qty: number;
  bulk_discount_pct: number;
  delivery_fee: number;
  tax_pct: number;
  estimated_delivery_days: number;
  status: string;
  notes?: string;
  supplier_name?: string;
  product_name?: string;
  supplier_rating?: number;
  is_demo: boolean;
  created_at: string;
}

export interface CampaignParticipant {
  id: string;
  campaign_id: string;
  user_id: string;
  quantity: number;
  expected_contribution: number;
  authorized_amount: number;
  paid_amount: number;
  refund_status: string;
  approved: boolean;
  user_name?: string;
  user_email?: string;
  joined_at: string;
}

export interface ProcurementCampaign {
  id: string;
  cluster_id?: string;
  title: string;
  product_name: string;
  category: string;
  target_quantity: number;
  current_quantity: number;
  min_required_quantity: number;
  target_funding: number;
  current_funding: number;
  estimated_unit_price: number;
  final_unit_price?: number;
  individual_market_unit_price: number;
  status: string;
  deadline: string;
  delivery_estimate: string;
  is_demo: boolean;
  created_at: string;
  participants_count?: number;
  participants?: CampaignParticipant[];
  quotes?: SupplierQuote[];
}

export interface AgentExecution {
  id: string;
  agent_name: string;
  input_summary: string;
  output_data: Record<string, any>;
  execution_time_ms: number;
  status: string;
  decision_explanation: string;
  related_entity_id?: string;
  created_at: string;
}

export interface RiskAssessment {
  id: string;
  target_type: string;
  target_id: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  explanation: string;
  assessed_at: string;
}

export interface FinancialLedgerEntry {
  id: string;
  campaign_id: string;
  user_id?: string;
  entry_type: string;
  amount: number;
  currency: string;
  description: string;
  balance_after: number;
  transaction_ref: string;
  created_at: string;
}

export interface DeliveryRecord {
  id: string;
  order_id: string;
  participant_id: string;
  address: string;
  carrier: string;
  tracking_number: string;
  status: string;
  estimated_arrival: string;
  last_location: string;
  updated_at: string;
}

export interface PredictiveDemand {
  category: string;
  predicted_item: string;
  expected_quantity_range: string;
  historical_demand_frequency: string;
  confidence_level: number;
  confidence_label: string;
  recommended_preparation_date: string;
  explanation: string;
  is_heuristic: boolean;
  data_points_analyzed: number;
}

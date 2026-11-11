const API_BASE = '/api';

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem('needbridge_token');
  }

  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errJson = await res.json();
        errorMsg = errJson.detail || errJson.message || errorMsg;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return res.json();
  }

  // --- Auth ---
  static async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(data: any) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // --- Demands ---
  static async getDemands(params?: { category?: string; mine?: boolean }) {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.mine) query.append('mine', 'true');
    return this.request<any[]>(`/demands/?${query.toString()}`);
  }

  static async createDemand(data: any) {
    return this.request<any>('/demands/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async previewAnalysis(data: any) {
    return this.request<any>('/demands/preview-analysis', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- Clusters ---
  static async getClusters() {
    return this.request<any[]>('/clusters/');
  }

  static async getCluster(id: string) {
    return this.request<any>(`/clusters/${id}`);
  }

  static async createCampaignFromCluster(clusterId: string) {
    return this.request<any>(`/clusters/${clusterId}/create-campaign`, {
      method: 'POST',
    });
  }

  // --- Campaigns ---
  static async getCampaigns(statusFilter?: string) {
    const q = statusFilter ? `?status_filter=${encodeURIComponent(statusFilter)}` : '';
    return this.request<any[]>(`/campaigns/${q}`);
  }

  static async getCampaign(id: string) {
    return this.request<any>(`/campaigns/${id}`);
  }

  static async joinCampaign(campaignId: string, quantity: number, demandId?: string) {
    return this.request<any>(`/campaigns/${campaignId}/join`, {
      method: 'POST',
      body: JSON.stringify({ quantity, demand_id: demandId }),
    });
  }

  static async approveCampaign(campaignId: string, approved: boolean, notes?: string) {
    return this.request<any>(`/campaigns/${campaignId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved, notes }),
    });
  }

  static async updateCampaignStatus(campaignId: string, newStatus: string) {
    return this.request<any>(`/campaigns/${campaignId}/status?new_status=${encodeURIComponent(newStatus)}`, {
      method: 'POST',
    });
  }

  // --- Suppliers ---
  static async getSuppliers(category?: string) {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<any[]>(`/suppliers/${q}`);
  }

  static async getProducts(category?: string) {
    const q = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<any[]>(`/suppliers/products${q}`);
  }

  static async addProduct(data: any) {
    return this.request<any>('/suppliers/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async submitQuote(data: any) {
    return this.request<any>('/suppliers/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async compareQuotes(campaignId: string) {
    return this.request<any>(`/suppliers/campaigns/${campaignId}/compare-quotes`);
  }

  // --- Payments & PayPal Sandbox ---
  static async createPayPalOrder(campaignId: string, quantity: number) {
    return this.request<any>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ campaign_id: campaignId, quantity }),
    });
  }

  static async capturePayPalOrder(orderId: string, campaignId: string) {
    return this.request<any>('/payments/capture-order', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, campaign_id: campaignId }),
    });
  }

  static async processRefund(transactionId: string) {
    return this.request<any>(`/payments/refund/${transactionId}`, {
      method: 'POST',
    });
  }

  // --- Transparent Ledger ---
  static async getCampaignLedger(campaignId: string) {
    return this.request<any>(`/ledger/campaign/${campaignId}`);
  }

  static async getAllLedger() {
    return this.request<any[]>('/ledger/all');
  }

  // --- Analytics & Predictive Engine ---
  static async getOverviewAnalytics() {
    return this.request<any>('/analytics/overview');
  }

  static async getPredictiveDemand() {
    return this.request<any[]>('/analytics/predictive-demand');
  }

  // --- AI Agents Activity Center ---
  static async getAgentActivity(limit = 50, agentName?: string) {
    const q = new URLSearchParams({ limit: limit.toString() });
    if (agentName) q.append('agent_name', agentName);
    return this.request<any[]>(`/agents/activity?${q.toString()}`);
  }

  static async getRiskAssessments() {
    return this.request<any[]>('/agents/risk-assessments');
  }

  static async runDemonstration() {
    return this.request<any>('/agents/run-demonstration', {
      method: 'POST',
    });
  }

  // --- Admin ---
  static async getAdminUsers() {
    return this.request<any[]>('/admin/users');
  }

  static async toggleSupplierVerification(supplierId: string) {
    return this.request<any>(`/admin/suppliers/${supplierId}/toggle-verify`, {
      method: 'POST',
    });
  }

  static async getAuditLogs() {
    return this.request<any[]>('/admin/audit-logs');
  }

  static async getAdminOverview() {
    return this.request<any>('/admin/overview');
  }
}

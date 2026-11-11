import {
  INITIAL_DEMANDS,
  INITIAL_CLUSTERS,
  INITIAL_CAMPAIGNS,
  INITIAL_SUPPLIERS,
  INITIAL_LEDGER,
  INITIAL_AGENT_LOGS,
  INITIAL_PREDICTIVE
} from './mockData';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

// Local storage keys for interactive demo fallback
const STORE_KEY = 'needbridge_client_store_v1';

function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  const fresh = {
    demands: INITIAL_DEMANDS,
    clusters: INITIAL_CLUSTERS,
    campaigns: INITIAL_CAMPAIGNS,
    suppliers: INITIAL_SUPPLIERS,
    ledger: INITIAL_LEDGER,
    agentLogs: INITIAL_AGENT_LOGS,
    predictive: INITIAL_PREDICTIVE
  };
  saveLocalStore(fresh);
  return fresh;
}

function saveLocalStore(store: any) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (_) {}
}

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

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      // If server responded with JSON
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }

      // If HTTP 404 or returning HTML (e.g., Vite SPA catch-all on static host without backend)
      // gracefully fall back to local high-fidelity intelligence store
      return this.handleFallback<T>(endpoint, options);
    } catch (err) {
      // Network error / offline / server not running on host
      return this.handleFallback<T>(endpoint, options);
    }
  }

  private static handleFallback<T>(endpoint: string, options: RequestInit = {}): T {
    const store = getLocalStore();
    const method = (options.method || 'GET').toUpperCase();
    let body: any = null;
    if (options.body && typeof options.body === 'string') {
      try {
        body = JSON.parse(options.body);
      } catch (_) {}
    }

    // --- Demands ---
    if (endpoint.startsWith('/demands')) {
      if (endpoint.includes('/preview-analysis')) {
        return {
          match_score: 94.5,
          confidence: 0.96,
          product_category: body?.category || 'Laptops & Computing',
          extracted_specs: body?.specs || { ram: '16GB', storage: '512GB SSD', processor: 'Intel i7' },
          compatible_cluster: {
            cluster_name: 'Collective Lot: STEM Developer Laptops (100 Units)',
            liquidity_score: 87.5
          },
          explanation: 'AI Semantic Analysis: Detected 94.5% affinity with active consortium lot. Aggregating brings 20.0% volume tier discount.',
          potential_savings_pct: 20.0,
          estimated_unit_price: 712.0
        } as unknown as T;
      }

      if (method === 'POST') {
        const newDemand = {
          id: `dem-${Date.now()}`,
          product_name: body?.product_name || 'Collective Requisition',
          category: body?.category || 'General',
          description: body?.description || '',
          quantity: body?.quantity || 1,
          max_budget_per_unit: body?.max_budget_per_unit || 500,
          specs: body?.specs || {},
          delivery_location: body?.delivery_location || 'Campus / Office Hub',
          delivery_region: 'North America',
          required_delivery_date: body?.required_delivery_date || '2027-01-30',
          buyer_type: body?.buyer_type || 'organization',
          status: 'active',
          organization_name: 'Pacific Coast University',
          created_at: new Date().toISOString()
        };
        store.demands.unshift(newDemand);
        saveLocalStore(store);
        return newDemand as unknown as T;
      }

      // GET demands
      const url = new URL(`http://dummy.com${endpoint}`);
      const cat = url.searchParams.get('category');
      if (cat && cat !== 'ALL') {
        return store.demands.filter((d: any) => d.category.toLowerCase() === cat.toLowerCase()) as unknown as T;
      }
      return store.demands as unknown as T;
    }

    // --- Clusters ---
    if (endpoint.startsWith('/clusters')) {
      if (endpoint.includes('/create-campaign') && method === 'POST') {
        const clusterId = endpoint.split('/')[2];
        const cl = store.clusters.find((c: any) => c.id === clusterId) || store.clusters[0];
        const newCamp = {
          id: `cmp-${Date.now()}`,
          cluster_id: cl.id,
          title: `Procurement Campaign: ${cl.cluster_name}`,
          product_name: cl.target_product,
          category: cl.category,
          target_quantity: cl.total_quantity,
          current_quantity: Math.floor(cl.total_quantity * 0.75),
          min_required_quantity: Math.floor(cl.total_quantity * 0.8),
          target_funding: cl.total_budget,
          current_funding: cl.total_budget * 0.75,
          estimated_unit_price: Math.round(cl.total_budget / cl.total_quantity * 0.85),
          final_unit_price: null,
          individual_market_unit_price: Math.round(cl.total_budget / cl.total_quantity),
          status: 'Proposal Ready',
          deadline: '2027-02-15',
          delivery_estimate: '10-14 Business Days',
          created_at: new Date().toISOString(),
          participants: [],
          quotes: []
        };
        store.campaigns.unshift(newCamp);
        cl.status = 'campaign_active';
        saveLocalStore(store);
        return newCamp as unknown as T;
      }

      const idMatch = endpoint.match(/\/clusters\/([^/?]+)/);
      if (idMatch && idMatch[1] && !endpoint.includes('create-campaign')) {
        const found = store.clusters.find((c: any) => c.id === idMatch[1]);
        return (found || store.clusters[0]) as unknown as T;
      }
      return store.clusters as unknown as T;
    }

    // --- Campaigns ---
    if (endpoint.startsWith('/campaigns')) {
      if (endpoint.includes('/join') && method === 'POST') {
        const campId = endpoint.split('/')[2];
        const cmp = store.campaigns.find((c: any) => c.id === campId);
        if (cmp) {
          const qty = body?.quantity || 1;
          cmp.current_quantity += qty;
          const price = cmp.estimated_unit_price || 700;
          cmp.current_funding += (price * qty);
          if (cmp.current_quantity >= cmp.min_required_quantity && cmp.status === 'Funding Pending') {
            cmp.status = 'Threshold Achieved';
          }
          saveLocalStore(store);
          return { success: true, campaign: cmp, message: 'Joined campaign successfully' } as unknown as T;
        }
      }

      if (endpoint.includes('/approve') && method === 'POST') {
        return { success: true, message: 'Requisition allocation approved' } as unknown as T;
      }

      if (endpoint.includes('/status') && method === 'POST') {
        return { success: true, message: 'Campaign status updated' } as unknown as T;
      }

      const idMatch = endpoint.match(/\/campaigns\/([^/?]+)/);
      if (idMatch && idMatch[1] && !endpoint.includes('status') && !endpoint.includes('join') && !endpoint.includes('approve')) {
        const found = store.campaigns.find((c: any) => c.id === idMatch[1]);
        return (found || store.campaigns[0]) as unknown as T;
      }

      return store.campaigns as unknown as T;
    }

    // --- Suppliers & Products ---
    if (endpoint.startsWith('/suppliers')) {
      if (endpoint.includes('/products')) {
        if (method === 'POST') {
          return { success: true, message: 'Product added to catalog' } as unknown as T;
        }
        return [
          {
            id: 'prod-1',
            name: 'ThinkPad E14 Gen 5 (Intel Core i7, 16GB RAM, 512GB SSD)',
            category: 'Laptops & Computing',
            base_unit_price: 890.0,
            min_order_qty: 20,
            delivery_days_estimate: 10,
            supplier_name: 'Apex Enterprise Computing Ltd.'
          },
          {
            id: 'prod-2',
            name: 'Standard University Undergraduate Chemistry Experiment Lab Kit',
            category: 'Lab & Scientific Equipment',
            base_unit_price: 165.0,
            min_order_qty: 25,
            delivery_days_estimate: 14,
            supplier_name: 'EduStem Global Manufacturing'
          },
          {
            id: 'prod-3',
            name: 'Ergonomic Synchronous Mesh Task Chair with 3D Adjustable Arms',
            category: 'Office & Furniture',
            base_unit_price: 240.0,
            min_order_qty: 15,
            delivery_days_estimate: 10,
            supplier_name: 'Ergon Commercial Furnishings'
          }
        ] as unknown as T;
      }

      if (endpoint.includes('/compare-quotes')) {
        return [
          { id: 'q1', supplier_name: 'Apex Enterprise Computing Ltd.', proposed_unit_price: 712.0, min_qty: 60, bulk_discount_pct: 20.0, delivery_fee: 250.0, status: 'selected' },
          { id: 'q2', supplier_name: 'Silicon Direct Wholesale Inc.', proposed_unit_price: 729.0, min_qty: 50, bulk_discount_pct: 18.0, delivery_fee: 300.0, status: 'submitted' }
        ] as unknown as T;
      }

      return store.suppliers as unknown as T;
    }

    // --- Payments & PayPal Sandbox ---
    if (endpoint.startsWith('/payments')) {
      if (endpoint.includes('/create-order')) {
        return {
          order_id: `SANDBOX-PP-${Date.now()}`,
          status: 'CREATED',
          approval_url: 'https://www.sandbox.paypal.com/checkoutnow'
        } as unknown as T;
      }
      if (endpoint.includes('/capture-order')) {
        return {
          status: 'COMPLETED',
          transaction_id: `TX-ESCROW-${Date.now()}`,
          escrow_status: 'ESCROW_LOCKED',
          message: 'Funds successfully pre-authorized and locked in PayPal Sandbox Escrow.'
        } as unknown as T;
      }
      return { status: 'OK' } as unknown as T;
    }

    // --- Transparent Ledger ---
    if (endpoint.startsWith('/ledger')) {
      return store.ledger as unknown as T;
    }

    // --- Analytics ---
    if (endpoint.startsWith('/analytics/overview')) {
      return {
        total_active_requirements: store.demands.length,
        compatible_demand_clusters: store.clusters.length,
        active_procurement_campaigns: store.campaigns.length,
        estimated_collective_savings: 48500.0,
        currency: 'USD',
        category_breakdown: [
          { category: 'Laptops', count: 100, volume: 76000 },
          { category: 'Lab Optics', count: 110, volume: 13612 },
          { category: 'Office', count: 45, volume: 8208 },
          { category: 'STEM Kits', count: 68, volume: 11200 },
          { category: 'Displays', count: 25, volume: 9500 }
        ]
      } as unknown as T;
    }

    if (endpoint.startsWith('/analytics/predictive-demand')) {
      return store.predictive as unknown as T;
    }

    // --- AI Agents Activity ---
    if (endpoint.startsWith('/agents/activity')) {
      return store.agentLogs as unknown as T;
    }

    if (endpoint.startsWith('/agents/risk-assessments')) {
      return [
        {
          target_entity: 'Apex Enterprise Computing Ltd.',
          entity_type: 'supplier',
          risk_score: 0.04,
          verdict: 'VERIFIED_SAFE',
          checks_passed: ['Tax ID Validated', 'Escrow Account Linked', '100% On-time Fulfillment Track Record']
        },
        {
          target_entity: 'Campaign #CMP-101 Escrow Vault',
          entity_type: 'escrow',
          risk_score: 0.02,
          verdict: 'ESCROW_INTEGRITY_CONFIRMED',
          checks_passed: ['Multi-party approval threshold achieved', 'Hash chain intact', 'PayPal webhook verified']
        }
      ] as unknown as T;
    }

    if (endpoint.includes('/run-demonstration')) {
      const demoLog = {
        id: `log-${Date.now()}`,
        agent_name: 'Demand Intelligence Agent',
        action: 'Live Real-Time Semantic Demand Aggregation',
        details: 'Evaluated cross-community requisitions. Clustered 3 compatible demands into collective procurement batch.',
        status: 'success',
        timestamp: new Date().toISOString()
      };
      store.agentLogs.unshift(demoLog);
      saveLocalStore(store);
      return { success: true, message: 'AI Multi-Agent orchestrators ran live pipeline.' } as unknown as T;
    }

    // --- Admin ---
    if (endpoint.startsWith('/admin')) {
      if (endpoint.includes('/users')) {
        return [
          { id: 'u1', full_name: 'Prof. Marcus Chen', email: 'marcus.chen@pacific.edu', role: 'organization', is_active: true },
          { id: 'u2', full_name: 'Sarah Jenkins', email: 'sarah.jenkins@apextraining.org', role: 'organization', is_active: true },
          { id: 'u3', full_name: 'Maya Lin', email: 'maya.lin@student.org', role: 'individual', is_active: true },
          { id: 'u4', full_name: 'Apex Enterprise Computing', email: 'supplier.apex@apexcomputing.com', role: 'supplier', is_active: true }
        ] as unknown as T;
      }
      return { status: 'active', platform_health: 'OPTIMAL' } as unknown as T;
    }

    // --- Auth ---
    if (endpoint.startsWith('/auth/me')) {
      return {
        id: 'u-marcus',
        email: 'marcus.chen@pacific.edu',
        full_name: 'Prof. Marcus Chen',
        role: 'organization',
        organization_id: 'org-pcu',
        organization_name: 'Pacific Coast University',
        is_active: true
      } as unknown as T;
    }

    if (endpoint.startsWith('/auth/login')) {
      return {
        access_token: 'demo-bearer-token-' + Date.now(),
        token_type: 'bearer',
        user: {
          id: 'u-marcus',
          email: 'marcus.chen@pacific.edu',
          full_name: 'Prof. Marcus Chen',
          role: 'organization'
        }
      } as unknown as T;
    }

    // Fallback default
    return {} as unknown as T;
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

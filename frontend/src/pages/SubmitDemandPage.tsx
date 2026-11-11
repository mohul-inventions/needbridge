import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Cpu,
  DollarSign,
  MapPin,
  Calendar,
  PackageCheck,
  RefreshCw
} from 'lucide-react';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface SubmitDemandPageProps {
  setTab: (tab: string) => void;
}

export const SubmitDemandPage: React.FC<SubmitDemandPageProps> = ({ setTab }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [aiPreview, setAiPreview] = useState<any>(null);

  const [form, setForm] = useState({
    product_name: 'Need 40 Programming Laptops for CS Sophomore Cohort',
    category: 'Laptops & Computing',
    description: 'College of Engineering requires 40 durable developer laptops with 16GB RAM, 512GB SSD, Intel i7 processor for Java and Docker systems labs.',
    quantity: 40,
    max_budget_per_unit: 920.0,
    specs: {
      ram: '16GB DDR5',
      storage: '512GB SSD',
      processor: 'Intel Core i7',
      warranty: '2 Years'
    },
    delivery_location: 'Pacific Coast University, Dept of Computer Science, Seattle, WA',
    delivery_region: 'North America',
    required_delivery_date: '2026-12-20',
    alternative_preference: 'compatible_alternatives_acceptable',
    buyer_type: user?.role === 'organization' ? 'university' : 'individual',
  });

  const handlePreFlightAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await ApiService.previewAnalysis(form);
      setAiPreview(res);
    } catch (e: any) {
      alert('Analysis error: ' + e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await ApiService.createDemand(form);
      setSuccessResult(res);
    } catch (e: any) {
      alert('Submission failed: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white">Intelligent Demand Discovery Requisition</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your purchasing requirement. Our AI agents will extract specifications, discover compatible buyers across independent communities, and aggregate volume.
            </p>
          </div>
        </div>
      </div>

      {successResult ? (
        <div className="bg-[#101729] border border-emerald-500/40 p-8 rounded-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Requirement Registered & Clustered!</h2>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            Your demand for <span className="text-sky-300 font-semibold">{successResult.quantity} units</span> of <span className="text-white font-semibold">{successResult.product_name}</span> has been processed through the Multi-Agent Demand Pipeline.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setTab('demand_clusters')}
              className="px-5 py-2.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors"
            >
              View Connected Demand Clusters
            </button>
            <button
              onClick={() => setTab('campaigns')}
              className="px-5 py-2.5 rounded-lg bg-[#151F33] border border-slate-700 text-white text-xs hover:bg-slate-800 transition-colors"
            >
              Explore Procurement Campaigns
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name / Requisition Title *</label>
              <input
                type="text"
                required
                value={form.product_name}
                onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                placeholder="e.g. 50 programming laptops for computer science cohort"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Laptops & Computing">Laptops & Computing</option>
                  <option value="Lab & Scientific Equipment">Lab & Scientific Equipment</option>
                  <option value="Office & Furniture">Office & Furniture</option>
                  <option value="Electronics & Displays">Electronics & Displays</option>
                  <option value="Clean Energy & Hardware">Clean Energy & Hardware</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Buyer Entity Type *</label>
                <select
                  value={form.buyer_type}
                  onChange={(e) => setForm({ ...form, buyer_type: e.target.value })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="university">University / Higher Ed</option>
                  <option value="training_center">Vocational Training Institute</option>
                  <option value="school">Secondary School (K-12)</option>
                  <option value="community_org">Community Organization / NGO</option>
                  <option value="small_business">Small Business / Lab Incubator</option>
                  <option value="individual">Individual Buyer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Natural-Language Description & Implicit Specs *</label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                placeholder="Mention desired RAM, processor, warranty, or form factor. AI will parse implicit constraints."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Required Quantity (Units) *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Maximum Unit Budget ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.max_budget_per_unit}
                  onChange={(e) => setForm({ ...form, max_budget_per_unit: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Delivery Destination *</label>
                <input
                  type="text"
                  required
                  value={form.delivery_location}
                  onChange={(e) => setForm({ ...form, delivery_location: e.target.value })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  placeholder="Facility or Campus address"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Required Delivery Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.required_delivery_date}
                  onChange={(e) => setForm({ ...form, required_delivery_date: e.target.value })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alternative Product Preference</label>
              <select
                value={form.alternative_preference}
                onChange={(e) => setForm({ ...form, alternative_preference: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="compatible_alternatives_acceptable">
                  Compatible Alternatives Acceptable (Recommended: Increases Bulk Clustering Liquidity)
                </option>
                <option value="exact_only">Exact Specifications Only (Strict Model Strictness)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handlePreFlightAnalysis}
                disabled={analyzing}
                className="px-4 py-2.5 rounded-lg bg-[#151F33] border border-violet-500/40 text-violet-300 hover:bg-violet-950/40 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Sparkles className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
                {analyzing ? 'Agent Analyzing...' : 'Run AI Pre-Flight Analysis'}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-sky-500/20"
              >
                {submitting ? 'Registering Requirement...' : 'Submit to Demand Network'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* AI Live Intelligence Inspector Panel */}
          <div className="space-y-4">
            <div className="bg-[#101729] border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Agent Intelligence Preview</h3>
              </div>

              {aiPreview ? (
                <div className="space-y-3">
                  {/* Extracted Specs */}
                  <div className="bg-[#151F33] p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Extracted Technical Attributes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(aiPreview.demand_intelligence.output.extracted_specs || {}).map(([k, v]: any) => (
                        <span key={k} className="text-[10px] bg-sky-950/80 text-sky-300 border border-sky-800/60 px-2 py-0.5 rounded">
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Liquidity Forecast */}
                  <div className="bg-[#151F33] p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Demand Liquidity Score:</span>
                      <span className="font-bold text-sky-400 font-mono">
                        {aiPreview.community_discovery.output.liquidity_data.score} / 100
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      {aiPreview.community_discovery.output.liquidity_data.interpretation}
                    </div>
                  </div>

                  {/* Matching Communities Found */}
                  <div className="bg-[#151F33] p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Cross-Community Counterparts</div>
                    <div className="text-xs font-semibold text-white">
                      {aiPreview.community_discovery.output.buyer_count} Compatible Communities Found
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {aiPreview.community_discovery.decision_explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                  <Sparkles className="w-8 h-8 text-slate-700 mx-auto" />
                  <p>Click "Run AI Pre-Flight Analysis" to see live specification extraction and cross-community compatibility scoring.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

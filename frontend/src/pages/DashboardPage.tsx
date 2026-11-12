import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ShieldAlert,
  Sparkles,
  Cpu,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { ApiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  setTab: (tab: string) => void;
  setSelectedCampaignId?: (id: string) => void;
}

const COLORS = ['#38BDF8', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899'];

export const DashboardPage: React.FC<DashboardPageProps> = ({ setTab, setSelectedCampaignId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>({
    total_active_requirements: 30,
    compatible_demand_clusters: 5,
    active_procurement_campaigns: 4,
    estimated_collective_savings: 48500.0,
    currency: 'USD',
  });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ov, camps, logs, ledger] = await Promise.all([
        ApiService.getOverviewAnalytics().catch(() => null),
        ApiService.getCampaigns().catch(() => []),
        ApiService.getAgentActivity(6).catch(() => []),
        ApiService.getAllLedger().catch(() => []),
      ]);

      if (ov && ov.metrics) {
        setMetrics(ov.metrics);
        setCategoryData(ov.category_distribution || []);
      } else if (ov && typeof ov.total_active_requirements === 'number') {
        setMetrics(ov);
        setCategoryData(ov.category_distribution || ov.category_breakdown || []);
      }
      setCampaigns(camps || []);
      setAgentLogs(logs || []);
      setLedgerEntries(ledger.slice(0, 5) || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Demand Intelligence Command Center
            <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-mono">
              Live Network
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-slate-200 font-semibold">{user?.full_name}</span> ({user?.role?.toUpperCase()}). Real-time collective demand aggregation and procurement analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-[#151F33] border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setTab('submit_demand')}
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-sky-500/20"
          >
            + Submit Requirement
          </button>
          <button
            onClick={() => setTab('agent_activity')}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5" />
            Agent Activity Center
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Active Requirements</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white font-mono">
            {metrics.total_active_requirements}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Across 5 Independent Communities</span>
          </div>
        </div>

        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Compatible Demand Clusters</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white font-mono">
            {metrics.compatible_demand_clusters}
          </div>
          <div className="mt-2 text-[11px] text-sky-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Avg Liquidity Score: 78.5/100</span>
          </div>
        </div>

        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Procurement Campaigns</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-white font-mono">
            {metrics.active_procurement_campaigns}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>1 Purchased • 1 Threshold Met • 2 In Funding</span>
          </div>
        </div>

        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Estimated Collective Savings</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-mono">
            ${metrics.estimated_collective_savings?.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>19.4% Average Reduction vs Retail</span>
          </div>
        </div>
      </div>

      {/* Main Visualizations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Distribution by Category */}
        <div className="lg:col-span-2 bg-[#101729] border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Demand Volume by Product Category</h2>
              <p className="text-[11px] text-slate-400">Units committed across active cross-community requisitions</p>
            </div>
            <button onClick={() => setTab('discovery_explorer')} className="text-xs text-sky-400 hover:underline flex items-center gap-1">
              Explorer <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData.length > 0 ? categoryData : [
                { category: 'Laptops', units: 100 },
                { category: 'Lab Optics', units: 110 },
                { category: 'Office', units: 45 },
                { category: 'STEM Kits', units: 75 },
                { category: 'Displays', units: 25 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#151F33', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#38BDF8' }}
                />
                <Bar dataKey="units" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Campaign Funding Distribution Pie */}
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Campaign Capital Allocation</h2>
            <p className="text-[11px] text-slate-400">Target funding volume by category</p>
          </div>

          <div className="h-52 my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={campaigns.map((c) => ({ name: c.category, value: c.target_funding }))}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {campaigns.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`$${val?.toLocaleString()}`, 'Target Funding']}
                  contentStyle={{ backgroundColor: '#151F33', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
            {campaigns.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{c.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recommended Active Campaigns & Recent AI Agent Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Campaigns */}
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                Active Procurement Campaigns
                <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1.5 py-0.2 rounded font-mono">
                  {campaigns.length} Active
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Ready for buyer approvals, funding, and order dispatch</p>
            </div>
            <button onClick={() => setTab('campaigns')} className="text-xs text-sky-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.slice(0, 3).map((camp) => {
              const fundingPct = Math.min(100, Math.round((camp.current_funding / (camp.target_funding || 1)) * 100));
              const qtyPct = Math.min(100, Math.round((camp.current_quantity / (camp.target_quantity || 1)) * 100));

              return (
                <div
                  key={camp.id}
                  onClick={() => {
                    if (setSelectedCampaignId) setSelectedCampaignId(camp.id);
                    setTab('campaign_details');
                  }}
                  className="bg-[#151F33] p-4 rounded-xl border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-violet-400 font-semibold">{camp.category}</span>
                      <h3 className="text-xs font-bold text-white leading-snug hover:text-sky-400 transition-colors">{camp.title}</h3>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      camp.status === 'Purchased' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' :
                      camp.status === 'Threshold Achieved' ? 'bg-sky-950 text-sky-300 border border-sky-700/50' :
                      'bg-amber-950 text-amber-300 border border-amber-700/50'
                    }`}>
                      {camp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] bg-[#101729]/60 p-2 rounded-lg">
                    <div>
                      <div className="text-slate-500">Committed</div>
                      <div className="font-bold text-slate-200">{camp.current_quantity} / {camp.target_quantity} units</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Bulk Unit Price</div>
                      <div className="font-bold text-sky-400">${camp.estimated_unit_price} <span className="line-through text-slate-500 text-[10px]">${camp.individual_market_unit_price}</span></div>
                    </div>
                    <div>
                      <div className="text-slate-500">Est. Savings</div>
                      <div className="font-bold text-emerald-400">
                        {Math.round(((camp.individual_market_unit_price - camp.estimated_unit_price) / camp.individual_market_unit_price) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Funding Progress (${camp.current_funding?.toLocaleString()} / ${camp.target_funding?.toLocaleString()})</span>
                      <span className="font-mono text-slate-300">{fundingPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${fundingPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Multi-Agent Recent Decisions */}
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-violet-400" />
                  Live AI Agent Decision Trace
                </h2>
                <p className="text-[11px] text-slate-400">Real-time decisions recorded by orchestrator agents</p>
              </div>
              <button onClick={() => setTab('agent_activity')} className="text-xs text-violet-400 hover:underline">
                Activity Center
              </button>
            </div>

            <div className="space-y-3">
              {agentLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="bg-[#151F33] p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-sky-300 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {log.agent_name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.execution_time_ms || 120}ms
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">
                    {log.decision_explanation || log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Orchestration: Fully Autonomous</span>
            <span className="text-emerald-400 font-medium">All 7 Agents Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

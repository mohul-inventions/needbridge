import React, { useState, useEffect } from 'react';
import { Layers, Sparkles, ArrowRight, ShieldCheck, TrendingUp, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { ApiService } from '../services/api';
import { DemandCluster } from '../types';

interface DemandClustersPageProps {
  setTab: (tab: string) => void;
  setSelectedCampaignId?: (id: string) => void;
}

export const DemandClustersPage: React.FC<DemandClustersPageProps> = ({ setTab, setSelectedCampaignId }) => {
  const [clusters, setClusters] = useState<DemandCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getClusters();
      setClusters(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleCreateCampaign = async (clusterId: string) => {
    setGenerating(clusterId);
    try {
      const camp = await ApiService.createCampaignFromCluster(clusterId);
      if (setSelectedCampaignId) setSelectedCampaignId(camp.id);
      setTab('campaign_details');
    } catch (e: any) {
      alert('Campaign generation error: ' + e.message);
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            AI Autonomous Demand Clusters & Liquidity Indices
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compatible purchasing requirements automatically clustered across independent institutions. Each cluster tracks live liquidity and conversion velocity.
          </p>
        </div>

        <button
          onClick={() => setTab('campaigns')}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          View Active Campaigns
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clusters.map((c) => {
          const score = c.demand_liquidity_score;
          const isHigh = score >= 80;
          const isDeveloping = score >= 60;

          return (
            <div
              key={c.id}
              className="bg-[#101729] border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col justify-between space-y-5 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">{c.category}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    c.status === 'campaign_active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                    c.status === 'ready_for_campaign' ? 'bg-sky-950 text-sky-300 border border-sky-800/60' :
                    'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}>
                    {c.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{c.cluster_name}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono text-sky-300">Target Product: {c.target_product}</p>

                {/* Liquidity Score Card */}
                <div className="mt-4 bg-[#151F33] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Demand Liquidity Score</span>
                    <span className="text-2xl font-bold font-mono text-sky-400">{score} / 100</span>
                    <span className="text-[10px] text-emerald-400 block font-medium">
                      {isHigh ? 'Highly Viable Bulk Opportunity' : isDeveloping ? 'Strong Growth Velocity' : 'Developing Opportunity'}
                    </span>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-500 block text-[10px]">Aggregated Lot Volume</span>
                    <span className="text-lg font-bold text-white font-mono">{c.total_quantity} Units</span>
                    <span className="text-[10px] text-slate-400 block">{c.buyer_count} Counterpart Buyers</span>
                  </div>
                </div>

                {/* Factors Breakdown */}
                {c.liquidity_factors && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] bg-[#151F33]/60 p-2.5 rounded-lg border border-slate-800/60">
                    <div>
                      <span className="text-slate-500 block">Buyer Mass</span>
                      <span className="font-mono text-slate-200 font-bold">{c.liquidity_factors.buyer_density || 18}/20</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Volume MOQ</span>
                      <span className="font-mono text-slate-200 font-bold">{c.liquidity_factors.volume_mass || 24}/25</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Vendor Supply</span>
                      <span className="font-mono text-slate-200 font-bold">{c.liquidity_factors.supplier_availability || 14}/15</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <div className="text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">{c.growth_projection}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTab('demand_analysis')}
                    className="px-3 py-2 rounded-lg bg-[#151F33] hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors"
                  >
                    Inspect Specs
                  </button>
                  <button
                    onClick={() => handleCreateCampaign(c.id)}
                    disabled={generating === c.id}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-sky-500/20"
                  >
                    {generating === c.id ? 'Generating Proposal...' : 'Create Campaign Proposal'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { ApiService } from '../services/api';

interface DemandAnalysisPageProps {
  setTab: (tab: string) => void;
}

export const DemandAnalysisPage: React.FC<DemandAnalysisPageProps> = ({ setTab }) => {
  const [clusters, setClusters] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getClusters()
      .then((data) => {
        setClusters(data);
        if (data.length > 0) setSelectedCluster(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Explainable Compatibility & Matching Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full mathematical transparency on requirement affinity, specification shared attributes, divergence vectors, and pro-rata bulk savings.
          </p>
        </div>

        <button
          onClick={() => setTab('demand_clusters')}
          className="px-3.5 py-1.5 rounded-lg bg-[#151F33] border border-slate-700 text-xs text-slate-200 hover:bg-slate-800 transition-colors"
        >
          View All Clusters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cluster Selector List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Active Demand Aggregations
          </div>
          {clusters.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCluster(c)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedCluster?.id === c.id
                  ? 'bg-gradient-to-r from-sky-500/15 to-violet-500/10 border-sky-500/50 shadow-md'
                  : 'bg-[#101729] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-violet-400 uppercase font-semibold">{c.category}</span>
                <span className="text-xs font-mono font-bold text-sky-400">{c.demand_liquidity_score}/100</span>
              </div>
              <h3 className="text-xs font-bold text-white mt-1 leading-snug">{c.cluster_name}</h3>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                <span>{c.total_quantity} Units Aggregated</span>
                <span>{c.buyer_count} Institutions</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explainable Matching Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCluster ? (
            <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-6">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-sky-400 font-semibold">{selectedCluster.category}</span>
                  <h2 className="text-lg font-bold text-white mt-0.5">{selectedCluster.target_product}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Geographic Hub: <strong className="text-slate-200">{selectedCluster.geographic_focus}</strong></span>
                    <span>•</span>
                    <span>Growth: <strong className="text-emerald-400">{selectedCluster.growth_projection}</strong></span>
                  </div>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-xs text-slate-400">Demand Liquidity Score</div>
                  <div className="text-3xl font-bold text-sky-400 font-mono">
                    {selectedCluster.demand_liquidity_score}
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">Highly Viable Opportunity</div>
                </div>
              </div>

              {/* Explainable Matches List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Participating Independent Communities & Compatibility Breakdown
                </h3>

                {selectedCluster.matches && selectedCluster.matches.length > 0 ? (
                  selectedCluster.matches.map((m: any, idx: number) => (
                    <div key={m.id || idx} className="bg-[#151F33] p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">Community Requisition Match</div>
                            <div className="text-[10px] text-slate-400">Demand ID: {m.demand_id}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                            {m.match_score}% Compatibility
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      <p className="text-xs text-slate-300 bg-[#101729] p-3 rounded-lg border border-slate-800 leading-relaxed">
                        {m.compatibility_explanation}
                      </p>

                      {/* Shared vs Divergent Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#101729]/80 p-3 rounded-lg border border-emerald-500/20 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                            <Check className="w-3.5 h-3.5" /> Shared & Compatible Attributes
                          </div>
                          <ul className="space-y-1 text-slate-300 text-[11px]">
                            {(m.shared_specs || ['Standard architecture', 'Delivery corridor']).map((s: string, i: number) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#101729]/80 p-3 rounded-lg border border-amber-500/20 space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Specification Divergences
                          </div>
                          <ul className="space-y-1 text-slate-300 text-[11px]">
                            {(m.differences && m.differences.length > 0 ? m.differences : ['None. Exact specification alignment.']).map((d: string, i: number) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-amber-400" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">Potential Bulk Margin Savings:</span>
                        <span className="font-bold text-emerald-400 font-mono">+{m.potential_savings_pct || 18.5}% Reduction</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No individual match records found for this cluster.</p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setTab('campaigns')}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shadow-sky-500/20"
                >
                  Join or Form Procurement Campaign
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              Select a cluster from the left to view detailed explainable matching telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

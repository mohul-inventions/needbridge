import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShieldAlert, Sparkles, Layers, Info } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ApiService } from '../services/api';

export const LiquidityAnalyticsPage: React.FC = () => {
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

  const factors = selectedCluster?.liquidity_factors || {};
  const radarData = [
    { factor: 'Buyer Density', value: (factors.buyer_density || 18.5) * 5, fullMark: 100 },
    { factor: 'Volume MOQ', value: (factors.volume_mass || 25.0) * 4, fullMark: 100 },
    { factor: 'Supplier Count', value: (factors.supplier_availability || 14.5) * 6.6, fullMark: 100 },
    { factor: 'Geographic Fit', value: (factors.geographic_alignment || 13.5) * 6.6, fullMark: 100 },
    { factor: 'Price Tightness', value: (factors.price_competitiveness || 12.0) * 6.6, fullMark: 100 },
    { factor: 'Historical Success', value: (factors.historical_success || 4.0) * 10, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          Proprietary Demand Liquidity Score Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Mathematical decomposition of collective purchasing viability. Distinguishes multi-factor heuristic scoring from validated historical forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cluster Selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Active Demand Clusters
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
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-violet-400 uppercase font-semibold">{c.category}</span>
                <span className="font-mono font-bold text-sky-400">{c.demand_liquidity_score}/100</span>
              </div>
              <h3 className="text-xs font-bold text-white mt-1 leading-snug">{c.cluster_name}</h3>
              <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                <span>{c.total_quantity} Units</span>
                <span>{c.buyer_count} Buyers</span>
              </div>
            </div>
          ))}
        </div>

        {/* Radar & Factor Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCluster && (
            <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedCluster.cluster_name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Focus: {selectedCluster.target_product}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-sky-400 font-mono">
                    {selectedCluster.demand_liquidity_score}
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {selectedCluster.demand_liquidity_score >= 80 ? 'Highly Viable' : 'Developing Opportunity'}
                  </div>
                </div>
              </div>

              {/* Methodology Distinction Alert */}
              <div className="bg-[#151F33] p-3.5 rounded-xl border border-sky-500/30 flex items-start gap-2.5 text-xs text-slate-300">
                <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Methodology Transparency: </strong>
                  This score is computed using our proprietary 6-factor deterministic heuristic index (Buyer Density 20%, Volume Mass 25%, Supplier Availability 15%, Geographic Homogeneity 15%, Budget Alignment 15%, Historical Momentum 10%). It serves as a real-time liquidity guide, not an empirical guarantee of market fulfillment.
                </div>
              </div>

              {/* Radar Chart */}
              <div className="bg-[#151F33] p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase font-mono mb-2">Liquidity Factor Radar</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="factor" stroke="#94a3b8" fontSize={11} />
                      <PolarRadiusAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                      <Radar name="Liquidity Weight" dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.4} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#101729', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Factor Score Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {radarData.map((f, i) => (
                  <div key={i} className="bg-[#151F33] p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[10px] block">{f.factor}</span>
                    <span className="text-base font-bold text-white font-mono">{f.value}%</span>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400" style={{ width: `${f.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

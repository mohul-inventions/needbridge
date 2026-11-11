import React, { useState, useEffect } from 'react';
import { Compass, Search, Filter, Building2, User, Layers, ArrowRight, Tag } from 'lucide-react';
import { ApiService } from '../services/api';
import { DemandRequest } from '../types';

interface DiscoveryExplorerPageProps {
  setTab: (tab: string) => void;
}

export const DiscoveryExplorerPage: React.FC<DiscoveryExplorerPageProps> = ({ setTab }) => {
  const [demands, setDemands] = useState<DemandRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getDemands()
      .then((data) => setDemands(data))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'Laptops & Computing', 'Lab & Scientific Equipment', 'Office & Furniture', 'Electronics & Displays', 'Clean Energy & Hardware'];

  const filtered = demands.filter((d) => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch =
      d.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.delivery_location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            Cross-Community Demand Discovery Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse live verified requirements across 5 sectors. Identify mutual purchasing affinities and cluster compatible procurement lots.
          </p>
        </div>

        <button
          onClick={() => setTab('submit_demand')}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          + Submit Requisition
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#101729] border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search keywords, specifications, campus or institution..."
            className="w-full bg-[#151F33] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-[#151F33] text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {cat === 'ALL' ? 'All Sectors' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Demands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-[#101729] border border-slate-800 hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="font-mono text-violet-400 font-semibold">{d.category}</span>
                <span className="bg-[#151F33] border border-slate-700 text-slate-300 px-2 py-0.5 rounded text-[10px] capitalize">
                  {d.buyer_type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{d.product_name}</h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{d.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-[#151F33] p-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Required Units</span>
                  <span className="font-bold text-white font-mono">{d.quantity} units</span>
                </div>
                <div className="bg-[#151F33] p-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px]">Max Budget / Unit</span>
                  <span className="font-bold text-emerald-400 font-mono">${d.max_budget_per_unit}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                <span className="truncate">{d.delivery_location}</span>
              </div>

              <button
                onClick={() => setTab('demand_clusters')}
                className="w-full py-2 rounded-lg bg-[#151F33] hover:bg-sky-500/10 border border-slate-700 hover:border-sky-500/40 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-all flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                Inspect Connected Cluster
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

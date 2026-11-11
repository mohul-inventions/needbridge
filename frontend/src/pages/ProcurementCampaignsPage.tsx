import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Tag,
  DollarSign
} from 'lucide-react';
import { ApiService } from '../services/api';
import { ProcurementCampaign } from '../types';

interface ProcurementCampaignsPageProps {
  setTab: (tab: string) => void;
  setSelectedCampaignId: (id: string) => void;
}

export const ProcurementCampaignsPage: React.FC<ProcurementCampaignsPageProps> = ({
  setTab,
  setSelectedCampaignId,
}) => {
  const [campaigns, setCampaigns] = useState<ProcurementCampaign[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getCampaigns()
      .then((data) => setCampaigns(data))
      .finally(() => setLoading(false));
  }, []);

  const statuses = [
    'ALL',
    'Proposal Ready',
    'Threshold Achieved',
    'Funding Pending',
    'Purchased',
    'Delivered',
  ];

  const filtered = campaigns.filter(
    (c) => selectedStatus === 'ALL' || c.status.toLowerCase() === selectedStatus.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            Institutional Collective Procurement Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active multi-buyer bulk purchasing initiatives. Transparent unit pricing, volume discount curves, and PayPal Sandbox authorized escrow.
          </p>
        </div>

        <button
          onClick={() => setTab('submit_demand')}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          + Submit New Requirement
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedStatus === st
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-[#101729] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((c) => {
          const fundingPct = Math.min(100, Math.round((c.current_funding / (c.target_funding || 1)) * 100));
          const savingsPct = Math.round(
            ((c.individual_market_unit_price - c.estimated_unit_price) / c.individual_market_unit_price) * 100
          );

          return (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCampaignId(c.id);
                setTab('campaign_details');
              }}
              className="bg-[#101729] border border-slate-800 hover:border-sky-500/50 p-6 rounded-2xl cursor-pointer transition-all space-y-5 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">{c.category}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      c.status === 'Purchased'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : c.status === 'Threshold Achieved'
                        ? 'bg-sky-950 text-sky-300 border border-sky-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">Product: {c.product_name}</p>

                {/* Pricing & Savings Banner */}
                <div className="mt-4 grid grid-cols-3 gap-2 bg-[#151F33] p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Bulk Price</span>
                    <span className="text-sm font-bold text-sky-400 font-mono">${c.estimated_unit_price}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Retail Baseline</span>
                    <span className="text-xs text-slate-400 line-through font-mono">${c.individual_market_unit_price}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Unit Savings</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">+{savingsPct}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Committed: <strong className="text-white">{c.current_quantity}</strong> / {c.target_quantity} units (MOQ: {c.min_required_quantity})
                    </span>
                    <span className="font-mono text-sky-400">{fundingPct}% Funded</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500"
                      style={{ width: `${fundingPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Deadline: {c.deadline}</span>
                </div>

                <div className="flex items-center gap-1 text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Inspect Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

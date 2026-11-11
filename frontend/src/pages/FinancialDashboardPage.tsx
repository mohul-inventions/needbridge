import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, CreditCard, ArrowUpRight, TrendingUp, Receipt, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';

interface FinancialDashboardPageProps {
  setTab: (tab: string) => void;
}

export const FinancialDashboardPage: React.FC<FinancialDashboardPageProps> = ({ setTab }) => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiService.getCampaigns().catch(() => []),
      ApiService.getAllLedger().catch(() => [])
    ]).then(([cData, lData]) => {
      setCampaigns(cData);
      setLedgerEntries(lData);
    }).finally(() => setLoading(false));
  }, []);

  const totalCommittedFunding = campaigns.reduce((acc, c) => acc + (c.current_funding || 0), 0);
  const totalTargetFunding = campaigns.reduce((acc, c) => acc + (c.target_funding || 0), 0);
  const totalSavings = campaigns.reduce((acc, c) => {
    const qty = c.current_quantity || 0;
    const diff = (c.individual_market_unit_price - c.estimated_unit_price) * qty;
    return acc + Math.max(0, diff);
  }, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Financial Intelligence & Escrow Treasury
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent institutional accounting. Multi-buyer escrow reconciliation, authorized funds, and verified savings auditing.
          </p>
        </div>

        <button
          onClick={() => setTab('ledger')}
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Receipt className="w-4 h-4" />
          View Complete Audit Ledger
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Authorized Escrow Capital</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white font-mono">
            ${totalCommittedFunding.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            PayPal Sandbox Authorized Holdings
          </p>
        </div>

        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Cumulative Procurement Target</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-bold text-sky-400 font-mono">
            ${totalTargetFunding.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-slate-400">
            Across {campaigns.length} Active Multi-Buyer Initiatives
          </p>
        </div>

        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Estimated Collective Savings</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-mono">
            ${totalSavings.toLocaleString()} USD
          </div>
          <p className="text-[11px] text-cyan-300">
            ~19.8% Average Cost Reduction
          </p>
        </div>
      </div>

      {/* Campaign Capital Table */}
      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white">Campaign Escrow & Funding Status</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono">
              <tr>
                <th className="py-2.5 px-3">Campaign Tender</th>
                <th className="py-2.5 px-3">Current Committed</th>
                <th className="py-2.5 px-3">Target Funding</th>
                <th className="py-2.5 px-3">Negotiated Bulk Rate</th>
                <th className="py-2.5 px-3">Retail Baseline</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">{c.title}</td>
                  <td className="py-3 px-3 font-mono font-bold text-sky-400">${c.current_funding?.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">${c.target_funding?.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">${c.estimated_unit_price}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 line-through">${c.individual_market_unit_price}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      c.status === 'Purchased' ? 'bg-emerald-950 text-emerald-300' : 'bg-sky-950 text-sky-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

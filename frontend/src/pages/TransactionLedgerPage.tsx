import React, { useState, useEffect } from 'react';
import { Receipt, ShieldCheck, CheckCircle2, AlertTriangle, ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';
import { ApiService } from '../services/api';

export const TransactionLedgerPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [ledgerData, setLedgerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getCampaigns()
      .then((data) => {
        setCampaigns(data);
        if (data.length > 0) {
          setSelectedCampaignId(data[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCampaignId) {
      ApiService.getCampaignLedger(selectedCampaignId)
        .then((res) => setLedgerData(res))
        .catch(() => setLedgerData(null));
    }
  }, [selectedCampaignId]);

  const summary = ledgerData?.financial_summary;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-400" />
            Transparent Procurement Ledger & Mathematical Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic ledger trail. Verifies Total Individual Cost baseline against actual collective landed procurement costs.
          </p>
        </div>

        {/* Campaign dropdown selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Audit Campaign:</span>
          <select
            value={selectedCampaignId}
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            className="bg-[#151F33] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {ledgerData ? (
        <div className="space-y-6">
          {/* Audit Formula Card */}
          <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Mathematical Audit Breakdown</h2>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                ledgerData.is_finalized ? 'bg-emerald-950 text-emerald-300' : 'bg-sky-950 text-sky-300'
              }`}>
                {summary?.savings_guarantee_notice}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#151F33] p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Total Individual Cost</span>
                <span className="text-base font-bold text-slate-300 font-mono">
                  ${summary?.total_individual_cost_baseline?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block">Baseline @ ${summary?.individual_market_unit_price}/unit</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Actual Collective Cost</span>
                <span className="text-base font-bold text-sky-400 font-mono">
                  ${summary?.actual_collective_cost?.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block">Landed (subtotal + tax + freight)</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Total Collective Savings</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  ${summary?.total_savings?.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">+{summary?.savings_percentage}% Saved</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">Aggregated Lot Units</span>
                <span className="text-base font-bold text-white font-mono">{summary?.total_quantity} Units</span>
                <span className="text-[10px] text-slate-400 block">Negotiated: ${summary?.collective_unit_price}/unit</span>
              </div>
            </div>
          </div>

          {/* Participant Breakdown Table */}
          <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Per-Buyer Allocation & Pro-Rata Savings</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Participant Buyer</th>
                    <th className="py-2.5 px-3">Allocated Qty</th>
                    <th className="py-2.5 px-3">Individual Cost</th>
                    <th className="py-2.5 px-3">Collective Share</th>
                    <th className="py-2.5 px-3">Net Realized Savings</th>
                    <th className="py-2.5 px-3">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ledgerData.participant_allocations?.map((p: any) => (
                    <tr key={p.participant_id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-semibold text-white">{p.user_name}</td>
                      <td className="py-3 px-3 font-mono">{p.quantity} units</td>
                      <td className="py-3 px-3 font-mono text-slate-400">${p.individual_baseline?.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-sky-300 font-bold">${p.allocated_collective_cost?.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        +${p.net_savings?.toLocaleString()} ({p.savings_pct}%)
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
                          Authorized (${p.authorized_amount})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Ledger Log Entries */}
          <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Immutable Event Log Stream</h3>

            <div className="space-y-2">
              {ledgerData.ledger_entries?.map((e: any) => (
                <div key={e.id} className="bg-[#151F33] p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      e.entry_type === 'ESCROW_HOLD' ? 'bg-sky-950 text-sky-400' :
                      e.entry_type === 'SUPPLIER_PAYOUT' ? 'bg-emerald-950 text-emerald-400' :
                      'bg-rose-950 text-rose-400'
                    }`}>
                      {e.entry_type}
                    </span>
                    <span className="text-slate-200">{e.description}</span>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`font-bold ${e.amount >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {e.amount >= 0 ? `+$${e.amount.toLocaleString()}` : `-$${Math.abs(e.amount).toLocaleString()}`} USD
                    </div>
                    <div className="text-[10px] text-slate-500">Ref: {e.transaction_ref}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500 text-xs">Loading ledger entries...</div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Users,
  DollarSign
} from 'lucide-react';
import { ApiService } from '../services/api';
import { ProcurementCampaign } from '../types';
import { useAuth } from '../context/AuthContext';

interface CampaignDetailsPageProps {
  campaignId: string | null;
  setTab: (tab: string) => void;
}

export const CampaignDetailsPage: React.FC<CampaignDetailsPageProps> = ({ campaignId, setTab }) => {
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<ProcurementCampaign | null>(null);
  const [quotesComparison, setQuotesComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals & form state
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinQty, setJoinQty] = useState(10);
  const [isJoining, setIsJoining] = useState(false);

  // PayPal Sandbox checkout state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState<any>(null);

  // Approval state
  const [isApproved, setIsApproved] = useState(true);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      let idToFetch = campaignId;
      if (!idToFetch) {
        const camps = await ApiService.getCampaigns();
        idToFetch = camps[0]?.id || null;
      }
      if (idToFetch) {
        const [cData, compData] = await Promise.all([
          ApiService.getCampaign(idToFetch),
          ApiService.compareQuotes(idToFetch).catch(() => null),
        ]);
        setCampaign(cData);
        setQuotesComparison(compData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const handleJoin = async () => {
    if (!campaign) return;
    setIsJoining(true);
    try {
      await ApiService.joinCampaign(campaign.id, joinQty);
      setJoinModalOpen(false);
      await fetchCampaign();
      alert(`Successfully committed ${joinQty} units to this procurement campaign!`);
    } catch (e: any) {
      alert('Error joining campaign: ' + e.message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleToggleApproval = async () => {
    if (!campaign) return;
    const nextApproved = !isApproved;
    setIsApproved(nextApproved);
    try {
      await ApiService.approveCampaign(campaign.id, nextApproved, 'Buyer consensus confirmed.');
      await fetchCampaign();
    } catch (e: any) {
      alert('Approval update error: ' + e.message);
    }
  };

  const handlePayPalCheckout = async () => {
    if (!campaign) return;
    setIsCapturing(true);
    try {
      // Step 1: Create order through backend
      const orderRes = await ApiService.createPayPalOrder(campaign.id, joinQty);
      
      // Step 2: Simulate PayPal Sandbox buyer approval and capture through backend verified workflow
      const captureRes = await ApiService.capturePayPalOrder(orderRes.order_id, campaign.id);
      setCaptureSuccess(captureRes);
      await fetchCampaign();
    } catch (e: any) {
      alert('PayPal Sandbox Checkout Error: ' + e.message);
    } finally {
      setIsCapturing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-xs">Loading campaign telemetry...</div>;
  }

  if (!campaign) {
    return (
      <div className="text-center py-20 text-slate-400 text-xs space-y-3">
        <p>No campaign found.</p>
        <button onClick={() => setTab('campaigns')} className="px-4 py-2 bg-sky-500 text-slate-950 font-bold rounded-lg text-xs">
          Return to Campaigns
        </button>
      </div>
    );
  }

  const fundingPct = Math.min(100, Math.round((campaign.current_funding / (campaign.target_funding || 1)) * 100));
  const savingsPct = Math.round(
    ((campaign.individual_market_unit_price - campaign.estimated_unit_price) / campaign.individual_market_unit_price) * 100
  );
  const totalRetail = campaign.current_quantity * campaign.individual_market_unit_price;
  const totalBulk = campaign.current_quantity * campaign.estimated_unit_price;
  const totalSavings = totalRetail - totalBulk;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top back bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={() => setTab('campaigns')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Campaigns
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('ledger')}
            className="px-3 py-1.5 rounded-lg bg-[#151F33] border border-slate-700 text-slate-200 text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Audit Ledger
          </button>
          <button
            onClick={() => setJoinModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-sky-500/20"
          >
            + Commit Units to Campaign
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">{campaign.category}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                campaign.status === 'Purchased' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                campaign.status === 'Threshold Achieved' ? 'bg-sky-950 text-sky-300 border border-sky-800/60' :
                'bg-amber-950 text-amber-300 border border-amber-800/60'
              }`}>
                {campaign.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">{campaign.title}</h1>
            <p className="text-xs text-slate-400 mt-1">
              Designated Model: <strong className="text-slate-200">{campaign.product_name}</strong> • Logistics corridor: North America
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleApproval}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isApproved
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-400" />
              {isApproved ? 'Proposal Approved by You' : 'Approve Proposal Terms'}
            </button>

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              PayPal Sandbox Escrow
            </button>
          </div>
        </div>

        {/* Financial Matrix Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#151F33] p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Collective Bulk Price</span>
            <span className="text-lg font-bold text-sky-400 font-mono">${campaign.estimated_unit_price}</span>
            <span className="text-[10px] text-slate-400 block line-through">${campaign.individual_market_unit_price} retail</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Net Collective Savings</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">${totalSavings?.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">+{savingsPct}% Margin Savings</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Committed Volume</span>
            <span className="text-lg font-bold text-white font-mono">{campaign.current_quantity} / {campaign.target_quantity}</span>
            <span className="text-[10px] text-slate-400 block">MOQ: {campaign.min_required_quantity} units</span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Deadline & Fulfillment</span>
            <span className="text-xs font-bold text-white">{campaign.deadline}</span>
            <span className="text-[10px] text-slate-400 block">{campaign.delivery_estimate}</span>
          </div>
        </div>

        {/* Funding Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>
              Authorized Escrow Capital: <strong className="text-white">${campaign.current_funding?.toLocaleString()}</strong> of ${campaign.target_funding?.toLocaleString()} Target
            </span>
            <span className="font-mono font-bold text-sky-400">{fundingPct}% Committed</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${fundingPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Grid: Participating Buyers & Supplier Quotes Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participating Buyers */}
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Participating Independent Buyers
              </h2>
              <p className="text-[11px] text-slate-400">Independent institutions sharing this procurement lot</p>
            </div>
            <span className="text-xs font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              {campaign.participants?.length || 0} Entities
            </span>
          </div>

          <div className="space-y-2.5">
            {campaign.participants?.map((p, idx) => (
              <div key={p.id || idx} className="bg-[#151F33] p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{p.user_name || 'Community Member'}</div>
                  <div className="text-[10px] text-slate-400">Allocated: {p.quantity} units</div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sky-400">${p.expected_contribution?.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end">
                    <CheckCircle className="w-3 h-3" /> Escrow Authorized
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Quotes Comparison Evaluated by Procurement Agent */}
        <div className="bg-[#101729] border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AI Procurement Quotations Audit
              </h2>
              <p className="text-[11px] text-slate-400">Evaluated on Total Value (unit price, MOQ, lead days, rating)</p>
            </div>
          </div>

          <div className="space-y-3">
            {campaign.quotes?.map((q, idx) => (
              <div
                key={q.id || idx}
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  q.status === 'selected'
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-[#151F33] border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    {q.supplier_name || 'Verified Supplier'}
                    {q.status === 'selected' && (
                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">
                        Recommended Best Value
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm font-bold text-sky-400">
                    ${q.proposed_unit_price} / unit
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 bg-[#101729] p-2 rounded-lg">
                  <div>MOQ: <strong className="text-slate-200">{q.min_qty} units</strong></div>
                  <div>Bulk Discount: <strong className="text-emerald-400">{q.bulk_discount_pct}%</strong></div>
                  <div>Lead Time: <strong className="text-slate-200">{q.estimated_delivery_days} days</strong></div>
                </div>

                {q.notes && (
                  <p className="text-[11px] text-slate-300 italic">"{q.notes}"</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Campaign Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101729] border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white">Commit Units to Campaign</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add your institution or individual allocation to this collective campaign. Pricing automatically locks to the negotiated institutional bulk rate.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity of Units</label>
              <input
                type="number"
                min={1}
                value={joinQty}
                onChange={(e) => setJoinQty(parseInt(e.target.value) || 1)}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="bg-[#151F33] p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Negotiated Bulk Unit Rate:</span>
                <span className="text-white font-mono">${campaign.estimated_unit_price}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Retail Baseline Reference:</span>
                <span className="line-through text-slate-500 font-mono">${campaign.individual_market_unit_price}</span>
              </div>
              <div className="flex justify-between font-bold text-sky-400 pt-1 border-t border-slate-800">
                <span>Expected Financial Commitment:</span>
                <span>${(joinQty * campaign.estimated_unit_price).toLocaleString()} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setJoinModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#151F33] text-slate-300 text-xs hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
              >
                {isJoining ? 'Committing...' : 'Confirm Commitment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Sandbox Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101729] border border-sky-500/40 p-6 rounded-2xl max-w-lg w-full space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <h2 className="text-base font-bold text-white">PayPal Sandbox Escrow Settlement</h2>
              </div>
              <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded font-mono">
                TESTING SANDBOX
              </span>
            </div>

            {captureSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Escrow Authorization Captured Successfully!</h3>
                <div className="bg-[#151F33] p-3 rounded-lg border border-slate-800 text-xs text-left space-y-1 font-mono">
                  <div className="text-slate-400">Capture ID: <span className="text-emerald-400">{captureSuccess.capture_id}</span></div>
                  <div className="text-slate-400">Amount: <span className="text-white">${captureSuccess.amount_captured} USD</span></div>
                  <div className="text-slate-400">Campaign Status: <span className="text-sky-400">{captureSuccess.campaign_status}</span></div>
                </div>
                <button
                  onClick={() => {
                    setCheckoutModalOpen(false);
                    setCaptureSuccess(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In accordance with NEEDBRIDGE Financial Safeguards, funds are held in verified Sandbox Escrow until threshold volume conditions are locked. Card numbers are never stored on the platform.
                </p>

                <div className="bg-[#151F33] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Authorized Quantity:</span>
                    <span className="text-white font-bold">{joinQty} units</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Negotiated Bulk Unit Rate:</span>
                    <span className="text-sky-400 font-mono font-bold">${campaign.estimated_unit_price}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800">
                    <span>Total Authorized Amount:</span>
                    <span className="text-emerald-400 font-mono">${(joinQty * campaign.estimated_unit_price).toLocaleString()} USD</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setCheckoutModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#151F33] text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayPalCheckout}
                    disabled={isCapturing}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    {isCapturing ? 'Verifying Sandbox...' : 'Authorize with PayPal Sandbox'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

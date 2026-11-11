import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Send, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { ApiService } from '../services/api';

export const SupplierDashboardPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'Laptops & Computing',
    description: '',
    base_unit_price: 750.0,
    min_order_qty: 25,
    delivery_days_estimate: 10,
    specs: { ram: '16GB', storage: '512GB SSD' },
    bulk_tiers: [{ min_qty: 50, discount_pct: 12 }, { min_qty: 100, discount_pct: 20 }]
  });

  // Quote form
  const [quoteForm, setQuoteForm] = useState({
    campaign_id: '',
    product_id: '',
    proposed_unit_price: 710.0,
    min_qty: 50,
    bulk_discount_pct: 15.0,
    delivery_fee: 200.0,
    tax_pct: 8.0,
    estimated_delivery_days: 10,
    notes: 'Direct manufacturer lot reservation with warranty.'
  });

  useEffect(() => {
    Promise.all([
      ApiService.getCampaigns().catch(() => []),
      ApiService.getProducts().catch(() => [])
    ]).then(([cData, pData]) => {
      setCampaigns(cData);
      setProducts(pData);
      if (cData.length > 0) setQuoteForm((prev) => ({ ...prev, campaign_id: cData[0].id }));
      if (pData.length > 0) setQuoteForm((prev) => ({ ...prev, product_id: pData[0].id }));
    });
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.addProduct(newProd);
      alert('Product SKU added to verified supplier catalog!');
      const updatedProds = await ApiService.getProducts();
      setProducts(updatedProds);
      setNewProd({
        name: '',
        category: 'Laptops & Computing',
        description: '',
        base_unit_price: 750.0,
        min_order_qty: 25,
        delivery_days_estimate: 10,
        specs: { ram: '16GB', storage: '512GB SSD' },
        bulk_tiers: [{ min_qty: 50, discount_pct: 12 }, { min_qty: 100, discount_pct: 20 }]
      });
    } catch (e: any) {
      alert('Error adding product: ' + e.message);
    }
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    try {
      await ApiService.submitQuote(quoteForm);
      setQuoteSuccess(true);
      setTimeout(() => setQuoteSuccess(false), 4000);
    } catch (e: any) {
      alert('Error submitting quote: ' + e.message);
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            Supplier Bidding & Product Catalog Portal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit formal volume quotations for collective campaign tenders, manage SKU inventories, and track accepted procurement orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Submission Form */}
        <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Send className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Submit Procurement Quotation (RFQ)</h2>
          </div>

          {quoteSuccess && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Quotation submitted! The AI Procurement Agent has ingested your bid for multi-attribute value scoring.
            </div>
          )}

          <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Target Campaign Tender *</label>
              <select
                value={quoteForm.campaign_id}
                onChange={(e) => setQuoteForm({ ...quoteForm, campaign_id: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title} ({c.current_quantity} / {c.target_quantity} units)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Designated Catalog Product *</label>
              <select
                value={quoteForm.product_id}
                onChange={(e) => setQuoteForm({ ...quoteForm, product_id: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Base: ${p.base_unit_price})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Proposed Bulk Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={quoteForm.proposed_unit_price}
                  onChange={(e) => setQuoteForm({ ...quoteForm, proposed_unit_price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bulk Discount %</label>
                <input
                  type="number"
                  value={quoteForm.bulk_discount_pct}
                  onChange={(e) => setQuoteForm({ ...quoteForm, bulk_discount_pct: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">MOQ Threshold</label>
                <input
                  type="number"
                  value={quoteForm.min_qty}
                  onChange={(e) => setQuoteForm({ ...quoteForm, min_qty: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Freight ($)</label>
                <input
                  type="number"
                  value={quoteForm.delivery_fee}
                  onChange={(e) => setQuoteForm({ ...quoteForm, delivery_fee: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Lead Days</label>
                <input
                  type="number"
                  value={quoteForm.estimated_delivery_days}
                  onChange={(e) => setQuoteForm({ ...quoteForm, estimated_delivery_days: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-2.5 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Supplier SLA & Batch Notes</label>
              <textarea
                rows={2}
                value={quoteForm.notes}
                onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                placeholder="Mention warranty terms, factory direct reservation, pallet details..."
              />
            </div>

            <button
              type="submit"
              disabled={submittingQuote}
              className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors"
            >
              {submittingQuote ? 'Transmitting Quotation...' : 'Submit Binding Quotation to Campaign'}
            </button>
          </form>
        </div>

        {/* Add Product SKU Form */}
        <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Register New Product SKU</h2>
          </div>

          <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">SKU / Model Name *</label>
              <input
                type="text"
                required
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                placeholder="e.g. Dell Latitude 3440 16GB RAM 512GB SSD"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Laptops & Computing">Laptops & Computing</option>
                  <option value="Lab & Scientific Equipment">Lab & Scientific Equipment</option>
                  <option value="Office & Furniture">Office & Furniture</option>
                  <option value="Electronics & Displays">Electronics & Displays</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Base Unit Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newProd.base_unit_price}
                  onChange={(e) => setNewProd({ ...newProd, base_unit_price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Technical Description</label>
              <textarea
                rows={2}
                value={newProd.description}
                onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                placeholder="Key specifications, certifications, warranty duration..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Standard MOQ (Units)</label>
                <input
                  type="number"
                  value={newProd.min_order_qty}
                  onChange={(e) => setNewProd({ ...newProd, min_order_qty: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Est. Lead Time (Days)</label>
                <input
                  type="number"
                  value={newProd.delivery_days_estimate}
                  onChange={(e) => setNewProd({ ...newProd, delivery_days_estimate: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors"
            >
              + Add Product to Verified Catalog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

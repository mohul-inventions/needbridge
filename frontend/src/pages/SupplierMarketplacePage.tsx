import React, { useState, useEffect } from 'react';
import { Store, ShieldCheck, Star, Package, ArrowRight, Search, CheckCircle } from 'lucide-react';
import { ApiService } from '../services/api';

interface SupplierMarketplacePageProps {
  setTab: (tab: string) => void;
}

export const SupplierMarketplacePage: React.FC<SupplierMarketplacePageProps> = ({ setTab }) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'suppliers' | 'products'>('suppliers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ApiService.getSuppliers().catch(() => []),
      ApiService.getProducts().catch(() => []),
    ])
      .then(([sData, pData]) => {
        setSuppliers(sData);
        setProducts(pData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-400" />
            Verified Supplier Marketplace & Product Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pre-vetted enterprise suppliers offering authenticated corporate registration, volume discount matrices, and audited logistics SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#101729] p-1 rounded-lg border border-slate-800 flex items-center">
            <button
              onClick={() => setActiveView('suppliers')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'suppliers' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400'
              }`}
            >
              Verified Vendors ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveView('products')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeView === 'products' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400'
              }`}
            >
              Product Catalog ({products.length})
            </button>
          </div>

          <button
            onClick={() => setTab('supplier_dashboard')}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
          >
            Supplier Portal
          </button>
        </div>
      </div>

      {activeView === 'suppliers' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-[#101729] border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-4 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-violet-400 uppercase font-semibold">{s.category}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{s.business_name}</h3>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded text-xs font-bold font-mono">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {s.rating}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-300">Enterprise KYC Authenticated</span>
                </div>
                <div>Location: <strong className="text-slate-300">{s.address}</strong></div>
                <div>Catalog Size: <strong className="text-sky-400 font-mono">{s.product_count} SKUs Active</strong></div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                  {s.is_demo ? 'Seeded Demo Vendor' : 'Live Vendor'}
                </span>
                <button
                  onClick={() => setActiveView('products')}
                  className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                >
                  View SKUs <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-[#101729] border border-slate-800 hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between space-y-4 transition-all">
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono text-violet-400 uppercase font-semibold">{p.category}</span>
                  <span className="text-slate-400 text-[10px]">{p.supplier_name}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{p.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#151F33] p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">Base Price</span>
                    <span className="font-bold text-sky-400 font-mono">${p.base_unit_price}</span>
                  </div>
                  <div className="bg-[#151F33] p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">MOQ Threshold</span>
                    <span className="font-bold text-white font-mono">{p.min_order_qty} units</span>
                  </div>
                </div>

                <button
                  onClick={() => setTab('submit_demand')}
                  className="w-full py-2 rounded-lg bg-[#151F33] hover:bg-sky-500/10 border border-slate-700 hover:border-sky-500/40 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-all flex items-center justify-center gap-1.5"
                >
                  Request Bulk Lot with this SKU
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

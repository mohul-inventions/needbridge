import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Store, ShoppingBag, DollarSign, Check, X, RefreshCw } from 'lucide-react';
import { ApiService } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [adminOverview, setAdminOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [uData, sData, ovData] = await Promise.all([
        ApiService.getAdminUsers().catch(() => []),
        ApiService.getSuppliers().catch(() => []),
        ApiService.getAdminOverview().catch(() => null),
      ]);
      setUsers(uData);
      setSuppliers(sData);
      setAdminOverview(ovData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleSupplier = async (supplierId: string) => {
    try {
      await ApiService.toggleSupplierVerification(supplierId);
      await fetchAdminData();
    } catch (e: any) {
      alert('Verification update error: ' + e.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Platform Administrator Governance Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee user permissions, investigate campaign integrity anomalies, authenticate supplier KYC statuses, and audit security events.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2 rounded-lg bg-[#151F33] border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#101729] border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-mono block">Registered Users</span>
          <span className="text-2xl font-bold text-white font-mono">{adminOverview?.total_users || users.length}</span>
        </div>
        <div className="bg-[#101729] border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-mono block">Verified Suppliers</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{adminOverview?.total_suppliers || suppliers.length}</span>
        </div>
        <div className="bg-[#101729] border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-mono block">Procurement Campaigns</span>
          <span className="text-2xl font-bold text-sky-400 font-mono">{adminOverview?.total_campaigns || 4}</span>
        </div>
        <div className="bg-[#101729] border border-slate-800 p-4 rounded-xl">
          <span className="text-slate-500 text-[10px] uppercase font-mono block">Escrow Transactions</span>
          <span className="text-2xl font-bold text-emerald-400 font-mono">{adminOverview?.total_transactions || 3}</span>
        </div>
      </div>

      {/* Suppliers Management Table */}
      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white">Supplier Verification & Anti-Dumping Governance</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono">
              <tr>
                <th className="py-2.5 px-3">Business Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Verification Standing</th>
                <th className="py-2.5 px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-white">{s.business_name}</td>
                  <td className="py-3 px-3 text-violet-400 font-mono">{s.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{s.rating} / 5.0</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      s.is_verified ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {s.is_verified ? 'KYC VERIFIED' : 'PENDING REVIEW'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleSupplier(s.id)}
                      className="px-2.5 py-1 rounded bg-[#151F33] hover:bg-slate-800 text-[11px] text-sky-400 font-medium"
                    >
                      {s.is_verified ? 'Revoke Status' : 'Approve Status'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Management */}
      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold text-white">Registered Multi-Tenant User Accounts</h2>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono sticky top-0 bg-[#101729]">
              <tr>
                <th className="py-2.5 px-3">Full Name</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Role Tier</th>
                <th className="py-2.5 px-3">Active Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-semibold text-white">{u.full_name}</td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] text-emerald-400 font-semibold font-mono">Active</span>
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

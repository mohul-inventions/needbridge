import React from 'react';
import { User, Building2, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RoleSelectionPageProps {
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onRoleSelected }) => {
  const { switchRole } = useAuth();

  const roles = [
    {
      id: 'individual' as UserRole,
      title: 'Individual Buyer',
      badge: 'Students & Independent Makers',
      icon: User,
      color: 'sky',
      description: 'Submit standalone requirements, discover collective group buying opportunities, and track individual pro-rata savings.',
      features: ['Submit natural-language requirements', 'Join collective lots', 'PayPal Sandbox escrow tracking', 'Automated per-buyer savings']
    },
    {
      id: 'organization' as UserRole,
      title: 'Organization Buyer',
      badge: 'Universities & High Schools',
      icon: Building2,
      color: 'violet',
      description: 'Aggregate institutional demands across departments, manage member authorizations, approve collective quotes, and download compliance audits.',
      features: ['Manage departmental requisitions', 'Invite organization members', 'Approve binding procurement bids', 'Institutional VAT & tax compliance']
    },
    {
      id: 'supplier' as UserRole,
      title: 'Verified Supplier',
      badge: 'Manufacturers & Wholesalers',
      icon: Store,
      color: 'amber',
      description: 'Register wholesale product lines, submit competitive volume tenders, specify tiered volume discounts, and manage accepted lots.',
      features: ['Manage product SKU catalog', 'Submit tenders on campaigns', 'Specify MOQs & tiered discounts', 'Carrier tracking and dispatch']
    },
    {
      id: 'admin' as UserRole,
      title: 'Platform Administrator',
      badge: 'Governance & Risk Operations',
      icon: ShieldCheck,
      color: 'emerald',
      description: 'Monitor multi-agent execution telemetry, investigate suspicious quote dumping, authenticate KYC registrations, and inspect platform financials.',
      features: ['Oversee all 7 AI orchestrators', 'Toggle supplier KYC badges', 'Audit immutable transaction ledger', 'System security monitoring']
    }
  ];

  const handleSelect = (r: UserRole) => {
    switchRole(r);
    onRoleSelected(r);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-800 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white">Select Your Operational Role</h1>
        <p className="text-xs text-slate-400 mt-1">
          Switch seamlessly between institutional personas to inspect the full end-to-end collective procurement lifecycle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              onClick={() => handleSelect(r.id)}
              className="bg-[#101729] border border-slate-800 hover:border-sky-500/60 p-6 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-5 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#151F33] border border-slate-700 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {r.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{r.description}</p>

                <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-800">
                  {r.features.map((feat, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-[#151F33] group-hover:bg-sky-500 group-hover:text-slate-950 font-semibold text-xs text-slate-200 transition-all flex items-center justify-center gap-2">
                Launch as {r.title}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

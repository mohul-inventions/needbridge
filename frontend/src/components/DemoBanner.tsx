import React from 'react';
import { ShieldCheck, Sparkles, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

export const DemoBanner: React.FC = () => {
  const { role, switchRole } = useAuth();

  return (
    <div className="bg-[#101729] border-b border-sky-500/20 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 font-semibold text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
          DEMO DATA ACTIVE
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <CreditCard className="w-3 h-3 text-violet-400" />
          PayPal Sandbox Escrow Verified
        </span>
        <span className="hidden md:flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          7 Multi-Agent Orchestrators Live
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 hidden sm:inline">Role Preview:</span>
        <div className="flex items-center gap-1 bg-[#151F33] p-0.5 rounded border border-slate-700">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.role}
              onClick={() => switchRole(acc.role)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                role === acc.role
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {acc.role === 'individual'
                ? 'Individual'
                : acc.role === 'organization'
                ? 'Org Buyer'
                : acc.role === 'supplier'
                ? 'Supplier'
                : 'Admin'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

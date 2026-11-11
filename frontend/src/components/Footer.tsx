import React from 'react';
import { Network, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B16] border-t border-slate-800 text-slate-400 py-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Network className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <span className="font-bold text-slate-200">NEEDBRIDGE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">AI-Powered Cross-Community Demand Intelligence & Collective Procurement</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            PayPal Sandbox Verified Escrow
          </span>
          <a href="/api/docs" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">
            FastAPI OpenAPI Docs
          </a>
          <span className="text-slate-500">© 2026 NEEDBRIDGE Global.</span>
        </div>
      </div>
    </footer>
  );
};

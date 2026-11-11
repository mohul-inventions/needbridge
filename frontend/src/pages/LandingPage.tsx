import React from 'react';
import { Network, Sparkles, ArrowRight, ShieldCheck, DollarSign, Layers, Users, Zap, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  return (
    <div className="min-h-screen bg-[#080B16] text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-950/60 via-indigo-950/40 to-violet-950/60 border-b border-sky-500/20 py-2.5 px-4 text-center text-xs font-medium text-sky-300">
        🚀 Next-Generation AI Demand Aggregator • Aggregating fragmented buyer demand into institutional bulk purchasing power.
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-36 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151F33] border border-sky-500/30 text-sky-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            7 Specialized Multi-Agent Orchestrators Active
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-slate-100 max-w-5xl mx-auto leading-tight">
            "Your needs are individual.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400">
              Your purchasing power is collective.
            </span>"
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            NEEDBRIDGE uses semantic AI agents to automatically discover compatible requirements across independent colleges, schools, non-profits, and individuals—uniting them into high-volume bulk procurement campaigns with institutional discounts.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm hover:from-sky-400 hover:to-indigo-500 transition-all shadow-lg shadow-sky-500/25 flex items-center gap-2"
            >
              Enter Application
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="px-8 py-3.5 rounded-xl bg-[#151F33] border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-[#1e2c47] hover:border-sky-500/50 transition-all"
            >
              Explore Demo Walkthrough
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#101729]/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-white font-mono">$48,500+</div>
              <div className="text-xs text-slate-400 mt-1">Est. Collective Savings</div>
            </div>
            <div className="bg-[#101729]/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-sky-400 font-mono">87.5 / 100</div>
              <div className="text-xs text-slate-400 mt-1">Avg Demand Liquidity</div>
            </div>
            <div className="bg-[#101729]/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-violet-400 font-mono">100 Units</div>
              <div className="text-xs text-slate-400 mt-1">Active Cluster Lot (Laptops)</div>
            </div>
            <div className="bg-[#101729]/80 border border-slate-800 p-4 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400 font-mono">100% Escrow</div>
              <div className="text-xs text-slate-400 mt-1">PayPal Sandbox Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Paradigm / How It Works */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-sky-400 tracking-wider uppercase font-mono">The Collective Intelligence Engine</h2>
          <p className="mt-2 text-3xl font-bold text-slate-100">How NEEDBRIDGE Replaces Fragmented Purchasing</p>
          <p className="mt-4 text-slate-400 text-sm">
            Instead of searching for group buys or paying inflated single-unit retail markups, our autonomous multi-agent mesh clusters compatible intent behind the scenes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl relative group hover:border-sky-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold mb-4">
              <PlusCircleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">1. Submit Individual Requirement</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Describe your requirement in natural language. Our Demand Intelligence Agent extracts processor specs, RAM, delivery region, and budget thresholds.
            </p>
          </div>

          <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl relative group hover:border-violet-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">2. Cross-Community Clustering</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Community Discovery Agent groups your need with compatible colleges, vocational institutes, and makers in your logistics corridor, computing the Demand Liquidity Score.
            </p>
          </div>

          <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl relative group hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">3. Coordinated Procurement</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Procurement Optimization Agent solicits competitive bids from verified tier-1 suppliers. Buyers approve proposals, funds clear via PayPal Sandbox Escrow, and bulk orders dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* The 7 AI Agents Grid */}
      <section className="py-16 bg-[#101729]/60 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-violet-400 tracking-wider uppercase font-mono">Orchestration Architecture</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-slate-100">7 Autonomous AI Agents with Auditable Records</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Demand Intelligence', role: 'Extracts implicit specs, normalizes categories & computes semantic embeddings.' },
              { name: 'Community Discovery', role: 'Clusters cross-institutional demands & evaluates geographic compatibility.' },
              { name: 'Procurement Optimization', role: 'Analyzes volume tiers, MOQ compliance, and Total Landed Cost.' },
              { name: 'Alternative Product', role: 'Detects component alternatives with specification parity verification.' },
              { name: 'Financial Intelligence', role: 'Calculates collective savings, pro-rata shares, and auditable ledger entries.' },
              { name: 'Risk & Trust Agent', role: 'Flags predatory dumping, vendor insolvency risks, and duplicate spam requests.' },
              { name: 'Procurement Coordinator', role: 'Validates buyer consensus, verifies escrow, and triggers order clearing.' },
              { name: 'Predictive Demand Engine', role: 'Forecasts semester and quarterly cyclical procurement patterns.' },
            ].map((agent, i) => (
              <div key={i} className="bg-[#151F33] p-4 rounded-xl border border-slate-800 hover:border-violet-500/40 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">{agent.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const PlusCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

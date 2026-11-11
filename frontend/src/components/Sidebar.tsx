import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  Compass,
  Layers,
  ShoppingBag,
  Store,
  Briefcase,
  Truck,
  Cpu,
  BarChart3,
  TrendingUp,
  DollarSign,
  Receipt,
  Building2,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  collapsed?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roleRestricted?: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const { role } = useAuth();

  const navSections: NavSection[] = [
    {
      title: 'DEMAND INTELLIGENCE',
      items: [
        { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
        { id: 'submit_demand', label: 'Submit Demand', icon: PlusCircle, badge: 'AI-Guided' },
        { id: 'demand_analysis', label: 'AI Demand Analysis', icon: Sparkles },
        { id: 'discovery_explorer', label: 'Discovery Explorer', icon: Compass },
        { id: 'demand_clusters', label: 'Demand Clusters', icon: Layers },
      ],
    },
    {
      title: 'COLLECTIVE PROCUREMENT',
      items: [
        { id: 'campaigns', label: 'Procurement Campaigns', icon: ShoppingBag },
        { id: 'suppliers', label: 'Supplier Marketplace', icon: Store },
        { id: 'supplier_dashboard', label: 'Supplier Dashboard', icon: Briefcase, roleRestricted: ['supplier', 'admin'] },
        { id: 'order_tracking', label: 'Order Tracking', icon: Truck },
      ],
    },
    {
      title: 'MULTI-AGENT ARCHITECTURE',
      items: [
        { id: 'agent_activity', label: 'Agent Activity Center', icon: Cpu, badge: 'Live 7 Agents' },
        { id: 'liquidity_analytics', label: 'Liquidity Analytics', icon: BarChart3 },
        { id: 'predictive_demand', label: 'Predictive Demand', icon: TrendingUp },
      ],
    },
    {
      title: 'FINANCIAL TRANSPARENCY',
      items: [
        { id: 'financial_dashboard', label: 'Financial Dashboard', icon: DollarSign },
        { id: 'ledger', label: 'Transaction Ledger', icon: Receipt },
        { id: 'organization', label: 'Organization Management', icon: Building2 },
        { id: 'admin', label: 'Platform Administrator', icon: ShieldCheck, roleRestricted: ['admin'] },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#080B16] border-r border-slate-800 flex flex-col justify-between h-[calc(100vh-5.5rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        {navSections.map((section, idx) => {
          const visibleItems = section.items.filter(
            (item) => !item.roleRestricted || item.roleRestricted.includes(role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 font-mono">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-sky-300 border border-sky-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          item.badge.includes('Live')
                            ? 'bg-violet-950 text-violet-300 border border-violet-800/40'
                            : 'bg-sky-950 text-sky-300 border border-sky-800/40'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-slate-800/80 bg-[#101729]/40 m-2 rounded-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300">NEEDBRIDGE Protocol</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Cross-Community Demand Aggregator v2.4 with Explainable AI & PayPal Escrow.
        </p>
      </div>
    </aside>
  );
};

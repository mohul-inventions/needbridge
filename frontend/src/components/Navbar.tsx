import React from 'react';
import { Network, Bell, User, LogOut, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  const { user, role, logout } = useAuth();

  const getRoleBadge = () => {
    switch (role) {
      case 'individual':
        return <span className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded text-xs font-medium">Individual Buyer</span>;
      case 'organization':
        return <span className="bg-violet-500/10 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded text-xs font-medium">Organization Buyer</span>;
      case 'supplier':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-medium">Verified Supplier</span>;
      case 'admin':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-xs font-medium">Platform Admin</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080B16]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-mono">NEED<span className="text-sky-400">BRIDGE</span></span>
              <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-700/50 px-1.5 py-0.2 rounded font-mono font-semibold">AI 2.0</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Demand Intelligence Network</p>
          </div>
        </div>

        {/* Center shortcuts */}
        <div className="hidden lg:flex items-center gap-1 bg-[#101729] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTab('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'dashboard' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab('submit_demand')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'submit_demand' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Submit Demand
          </button>
          <button
            onClick={() => setTab('campaigns')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'campaigns' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setTab('agent_activity')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentTab === 'agent_activity' ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            AI Agents
          </button>
          <button
            onClick={() => setTab('ledger')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'ledger' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ledger
          </button>
        </div>

        {/* Right user & quick actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTab('notifications')}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-400 rounded-full" />
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('profile')}
              className="flex items-center gap-2 text-left p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#151F33] border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">{user?.full_name || 'Guest User'}</div>
                {getRoleBadge()}
              </div>
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

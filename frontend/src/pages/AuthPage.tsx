import React, { useState } from 'react';
import { Network, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { login, register, switchRole, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'individual' | 'organization' | 'supplier' | 'admin'>('individual');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isRegister) {
        await register({ email, password, full_name: fullName, role });
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleQuickDemoLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setError(null);
    try {
      await login(acc.email, acc.pass);
      onSuccess();
    } catch (_) {
      // In case server is not running, switch role directly in frontend state
      switchRole(acc.role);
      onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#080B16] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/25">
          <Network className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight font-mono">
          NEED<span className="text-sky-400">BRIDGE</span>
        </h1>
        <p className="text-xs text-slate-400">
          AI-Powered Cross-Community Demand Intelligence & Collective Procurement
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Logins Helper */}
        <div className="bg-[#101729] border border-sky-500/30 p-4 rounded-xl mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> One-Click Demo Personas
            </span>
            <span className="text-[10px] text-slate-500 font-mono">JUDGES / EVALUATION</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleQuickDemoLogin(acc)}
                className="p-2 rounded-lg bg-[#151F33] border border-slate-700 hover:border-sky-500/60 text-left transition-all group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-sky-300 truncate">
                  {acc.role.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{acc.label.split('(')[0].trim()}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#101729] border border-slate-800 py-8 px-6 sm:px-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex border-b border-slate-800 pb-2">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 text-center py-2 text-xs font-semibold border-b-2 transition-all ${
                !isRegister ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 text-center py-2 text-xs font-semibold border-b-2 transition-all ${
                isRegister ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {isRegister && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Legal / Institution Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Prof. Marcus Chen / Pacific Coast University"
                    className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Platform Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="individual">Individual Buyer</option>
                    <option value="organization">Organization Buyer</option>
                    <option value="supplier">Verified Supplier</option>
                    <option value="admin">Platform Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate or Educational Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5"
            >
              {isLoading ? 'Authenticating...' : isRegister ? 'Register Persona' : 'Sign In to NEEDBRIDGE'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { User, Building2, ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserProfilePage: React.FC = () => {
  const { user, role } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-sky-400" />
          Buyer & Institutional Entity Profile
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Manage your verified organizational credentials, campus delivery destinations, and authorized procurement representatives.
        </p>
      </div>

      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-sky-500/20">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono uppercase bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded">
                Role: {role}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Entity Standing
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#151F33] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-sky-400" /> Authenticated Email</span>
            <span className="text-white font-medium">{user?.email}</span>
          </div>

          <div className="bg-[#151F33] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-violet-400" /> Organization Membership</span>
            <span className="text-white font-medium">Pacific Coast University (Dept of CS)</span>
          </div>

          <div className="bg-[#151F33] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> Delivery Logistics Node</span>
            <span className="text-white font-medium">400 University Way, Seattle, WA</span>
          </div>

          <div className="bg-[#151F33] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" /> Procurement Score</span>
            <span className="text-white font-medium font-mono">98.5 / 100 (Flawless Escrow Clearing)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

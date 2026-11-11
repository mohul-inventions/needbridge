import React, { useState } from 'react';
import { Building2, Users, Plus, ShieldCheck, Download, Check } from 'lucide-react';

export const OrganizationPage: React.FC = () => {
  const [members] = useState<any[]>([
    { id: '1', name: 'Prof. Marcus Chen', email: 'marcus.chen@pacific.edu', role: 'Procurement Director', status: 'Active' },
    { id: '2', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@pacific.edu', role: 'Lab Coordinator', status: 'Active' },
    { id: '3', name: 'Alex Rivera', email: 'alex.rivera@pacific.edu', role: 'Department Fiscal Lead', status: 'Active' }
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-400" />
            Institutional Organization & Member Governance
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage multi-user department authorizations, aggregate requisitions, and download procurement audit summaries.
          </p>
        </div>

        <button
          onClick={() => alert('Downloaded formal PDF procurement compliance report (DEMO).')}
          className="px-4 py-2 rounded-lg bg-[#151F33] border border-slate-700 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-1.5"
        >
          <Download className="w-4 h-4 text-sky-400" />
          Download Compliance Audit PDF
        </button>
      </div>

      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white">Authorized Procurement Delegates</h2>
            <p className="text-[11px] text-slate-400">Team members permitted to commit organizational escrow funds</p>
          </div>
          <button
            onClick={() => alert('Invitation modal opened.')}
            className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
          >
            + Invite Member
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[10px] text-slate-400 uppercase font-mono">
              <tr>
                <th className="py-2.5 px-3">Member Name</th>
                <th className="py-2.5 px-3">Official Email</th>
                <th className="py-2.5 px-3">Institutional Role</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-white">{m.name}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{m.email}</td>
                  <td className="py-3 px-3 text-slate-400">{m.role}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
                      {m.status}
                    </span>
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

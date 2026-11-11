import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';

interface NotificationsPageProps {
  setTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setTab }) => {
  const [notifications] = useState<any[]>([
    {
      id: 'n1',
      title: 'Demand Cluster Formed for Developer Laptops',
      message: 'Your requirement for 40 laptops has been matched with 2 independent institutions. Total lot size: 100 units (20% bulk discount tier unlocked).',
      type: 'SUCCESS',
      time: '15 mins ago',
      link: 'campaigns'
    },
    {
      id: 'n2',
      title: 'Supplier Quotation Selected & Ready for Approval',
      message: 'Apex Enterprise Computing submitted a winning bulk quotation ($712/unit). Please review and approve your participation.',
      type: 'ACTION_REQUIRED',
      time: '12 mins ago',
      link: 'campaigns'
    },
    {
      id: 'n3',
      title: 'PayPal Sandbox Escrow Authorization Captured',
      message: 'Authorized escrow contribution of $28,480.00 confirmed by PayPal Sandbox API. Funds held in audited escrow.',
      type: 'SUCCESS',
      time: '7 mins ago',
      link: 'ledger'
    },
    {
      id: 'n4',
      title: 'Consortium AP Chemistry Kit Batch Formed',
      message: 'New cluster forming in Eastern Seaboard for undergraduate borosilicate chemistry experiment kits.',
      type: 'INFO',
      time: '2 hours ago',
      link: 'demand_clusters'
    }
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-sky-400" />
          Network Notifications & Procurement Alerts
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time updates regarding demand matches, quote selections, escrow authorizations, and delivery milestones.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-[#101729] border border-slate-800 p-4 rounded-xl flex items-start justify-between gap-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#151F33] border border-slate-700 shrink-0 mt-0.5">
                {n.type === 'SUCCESS' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : n.type === 'ACTION_REQUIRED' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <Info className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white">{n.title}</h3>
                  <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
              </div>
            </div>

            {n.link && (
              <button
                onClick={() => setTab(n.link)}
                className="px-3 py-1.5 rounded-lg bg-[#151F33] hover:bg-slate-800 text-xs text-sky-400 font-semibold transition-colors shrink-0 flex items-center gap-1"
              >
                View <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

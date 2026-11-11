import React, { useState } from 'react';
import { Truck, PackageCheck, MapPin, CheckCircle, Clock, ExternalLink } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const [deliveries] = useState<any[]>([
    {
      id: 'del-1',
      campaign_title: 'Cross-Community STEM Laptop Collective Procurement',
      carrier: 'FedEx Ground Freight',
      tracking_number: 'FEDEX-SEA-4019',
      recipient: 'Pacific Coast University, 400 University Way, Seattle, WA',
      status: 'In Transit',
      units: 40,
      estimated_arrival: '2026-12-14',
      last_location: 'Regional Distribution Hub, Portland, OR',
      steps: ['Order Placed', 'Supplier Confirmed', 'Factory Batch Dispatched', 'In Regional Transit', 'Out for Delivery', 'Delivered']
    },
    {
      id: 'del-2',
      campaign_title: 'Cross-Community STEM Laptop Collective Procurement',
      carrier: 'FedEx Ground Freight',
      tracking_number: 'FEDEX-DEN-3312',
      recipient: 'Apex Training Center, 400 Tech Hub, Denver, CO',
      status: 'In Transit',
      units: 35,
      estimated_arrival: '2026-12-13',
      last_location: 'Central Freight Hub, Salt Lake City, UT',
      steps: ['Order Placed', 'Supplier Confirmed', 'Factory Batch Dispatched', 'In Regional Transit', 'Out for Delivery', 'Delivered']
    },
    {
      id: 'del-3',
      campaign_title: 'Cross-Community STEM Laptop Collective Procurement',
      carrier: 'FedEx Ground Freight',
      tracking_number: 'FEDEX-CHI-8821',
      recipient: 'Community Guild HQ, 120 Michigan Ave, Chicago, IL',
      status: 'In Transit',
      units: 25,
      estimated_arrival: '2026-12-14',
      last_location: 'Midwest Transfer Facility, Des Moines, IA',
      steps: ['Order Placed', 'Supplier Confirmed', 'Factory Batch Dispatched', 'In Regional Transit', 'Out for Delivery', 'Delivered']
    }
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-sky-400" />
          Bulk Logistics & Freight Distribution Tracking
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Live carrier integration. Track coordinated split-shipments dispatched directly from factory suppliers to independent campus delivery nodes.
        </p>
      </div>

      <div className="space-y-4">
        {deliveries.map((del) => (
          <div key={del.id} className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-violet-400 uppercase font-semibold">{del.carrier}</span>
                <h3 className="text-sm font-bold text-white">{del.campaign_title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Destination: <strong className="text-slate-200">{del.recipient}</strong></p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-800 px-2 py-0.5 rounded">
                  {del.tracking_number}
                </span>
                <div className="text-[11px] text-emerald-400 mt-1">Est. Arrival: {del.estimated_arrival}</div>
              </div>
            </div>

            {/* Stepper */}
            <div className="py-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                <span>Dispatched</span>
                <span className="text-sky-400 font-semibold">Current: {del.last_location}</span>
                <span>Final Delivery</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 w-2/3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 bg-[#151F33] p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span>Quantity: <strong className="text-white font-mono">{del.units} Units</strong> in shock-proof pallet packaging</span>
              </div>
              <span className="text-emerald-400 font-semibold">{del.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

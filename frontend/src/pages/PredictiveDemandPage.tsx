import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, AlertCircle, CheckCircle2, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import { PredictiveDemand } from '../types';

export const PredictiveDemandPage: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictiveDemand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiService.getPredictiveDemand()
      .then((data) => setPredictions(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          Predictive Community Demand & Cyclical Procurement Trends
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Analyzes multi-year institutional procurement cadences to forecast semester intakes, fiscal year-end grant spending, and recurring bulk cycles.
        </p>
      </div>

      <div className="space-y-4">
        {predictions.map((p, idx) => {
          const hasConfidence = p.confidence_level > 0;

          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border transition-all ${
                hasConfidence
                  ? 'bg-[#101729] border-slate-800 hover:border-slate-700'
                  : 'bg-[#101729]/60 border-amber-500/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-violet-400 font-semibold uppercase">{p.category}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      hasConfidence
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}>
                      {p.confidence_label}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{p.predicted_item}</h3>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Recommended Prep Date</div>
                  <div className="text-xs font-bold text-sky-400 flex items-center sm:justify-end gap-1.5 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {p.recommended_preparation_date}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#151F33] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Expected Volume Range</span>
                  <span className="text-sm font-bold text-white font-mono">{p.expected_quantity_range}</span>
                </div>

                <div className="bg-[#151F33] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Recurrence Pattern</span>
                  <span className="text-xs font-semibold text-slate-200">{p.historical_demand_frequency}</span>
                </div>

                <div className="bg-[#151F33] p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Observed Historical Spikes</span>
                  <span className="text-sm font-bold text-sky-400 font-mono">
                    {p.data_points_analyzed} cycles logged
                  </span>
                </div>
              </div>

              <div className="mt-4 bg-[#151F33]/60 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
                {hasConfidence ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="text-white">Pattern Explanation: </strong>
                  {p.explanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

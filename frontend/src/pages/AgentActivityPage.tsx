import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Terminal
} from 'lucide-react';
import { ApiService } from '../services/api';
import { AgentExecution } from '../types';

export const AgentActivityPage: React.FC = () => {
  const [executions, setExecutions] = useState<AgentExecution[]>([]);
  const [filterAgent, setFilterAgent] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [runningDemo, setRunningDemo] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAgentActivity(50, filterAgent === 'ALL' ? undefined : filterAgent);
      setExecutions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterAgent]);

  const handleRunDemonstration = async () => {
    setRunningDemo(true);
    try {
      await ApiService.runDemonstration();
      await fetchLogs();
    } catch (e: any) {
      alert('Demonstration execution error: ' + e.message);
    } finally {
      setRunningDemo(false);
    }
  };

  const agentNames = [
    'ALL',
    'Demand Intelligence Agent',
    'Community Discovery Agent',
    'Procurement Optimization Agent',
    'Alternative Product Agent',
    'Financial Intelligence Agent',
    'Risk & Trust Agent',
    'Procurement Coordinator Agent',
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/30">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Autonomous AI Agent Activity Center
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  7 Agents Active
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time auditable execution traces from backend multi-agent orchestration. Inspect inputs, outputs, milliseconds latency, and decision logic.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            className="p-2 rounded-lg bg-[#151F33] border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleRunDemonstration}
            disabled={runningDemo}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white font-bold text-xs transition-all shadow-lg shadow-violet-500/25 flex items-center gap-2"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${runningDemo ? 'animate-spin' : ''}`} />
            {runningDemo ? 'Orchestrating 7 Agents...' : 'Run Live Multi-Agent Pipeline'}
          </button>
        </div>
      </div>

      {/* Agents Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { name: 'Demand Int.', id: 'Demand Intelligence Agent', color: 'sky' },
          { name: 'Community', id: 'Community Discovery Agent', color: 'violet' },
          { name: 'Procurement', id: 'Procurement Optimization Agent', color: 'emerald' },
          { name: 'Alternatives', id: 'Alternative Product Agent', color: 'indigo' },
          { name: 'Financial', id: 'Financial Intelligence Agent', color: 'cyan' },
          { name: 'Risk & Trust', id: 'Risk & Trust Agent', color: 'amber' },
          { name: 'Coordinator', id: 'Procurement Coordinator Agent', color: 'purple' },
        ].map((ag, i) => (
          <button
            key={i}
            onClick={() => setFilterAgent(ag.id === filterAgent ? 'ALL' : ag.id)}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              filterAgent === ag.id
                ? 'bg-violet-950/60 border-violet-500 text-white'
                : 'bg-[#101729] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 mx-auto mb-1 animate-pulse" />
            <div className="text-[11px] font-bold truncate">{ag.name}</div>
            <div className="text-[9px] text-slate-500 font-mono">Operational</div>
          </button>
        ))}
      </div>

      {/* Execution Timeline */}
      <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-400" />
            Auditable Execution Stream ({executions.length} Logged Events)
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Backend Source: <span className="text-slate-300">FastAPI & SQLite Event Bus</span>
          </div>
        </div>

        <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800 before:z-0">
          {executions.map((exec) => {
            const isExpanded = expandedId === exec.id;

            return (
              <div
                key={exec.id}
                className="relative z-10 pl-8 space-y-2 group"
              >
                {/* Node icon indicator */}
                <div className="absolute left-1.5 top-3.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#080B16] border-2 border-sky-400 group-hover:scale-125 transition-transform" />

                <div className="bg-[#151F33] border border-slate-800/80 group-hover:border-slate-700 p-4 rounded-xl space-y-2 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-xs">{exec.agent_name}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-1.5 py-0.2 rounded font-mono">
                        {exec.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {exec.execution_time_ms} ms
                      </span>
                      <span>{new Date(exec.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {exec.decision_explanation}
                  </p>

                  <div className="text-[11px] text-slate-400 bg-[#101729]/70 p-2 rounded-lg font-mono">
                    <span className="text-slate-500">Input: </span>
                    {exec.input_summary}
                  </div>

                  {/* Expand JSON Output Toggle */}
                  <div className="pt-1 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500 font-mono text-[10px]">ID: {exec.id.substring(0, 18)}...</span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : exec.id)}
                      className="text-sky-400 hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>Hide Structured Output <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Inspect Agent Output JSON <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2 p-3 rounded-lg bg-[#080B16] border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-56">
                      <pre>{JSON.stringify(exec.output_data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

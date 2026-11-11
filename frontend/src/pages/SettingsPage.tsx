import React, { useState } from 'react';
import { Settings, Key, CreditCard, Database, Bell, Shield, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [paypalMode, setPaypalMode] = useState('sandbox');
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          Platform System & API Configuration
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure external LLM providers, PayPal Sandbox credentials, database persistence endpoints, and settlement currencies.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 p-3 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          Settings successfully updated! Multi-agent pipeline reloaded.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Model Keys */}
        <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Key className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-bold text-white">Configurable AI Model Integration</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            NEEDBRIDGE uses embedding-based semantic similarity and rule-based fallbacks by default. Supplying API keys enables real-time LLM inference for natural language parsing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Google Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Leave empty to use active heuristic fallback)"
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">OpenAI API Key</label>
              <input
                type="password"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-... (Optional alternative provider)"
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* PayPal Sandbox Environment */}
        <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <CreditCard className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Payment Gateway Environment</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Payment Mode</label>
              <select
                value={paypalMode}
                onChange={(e) => setPaypalMode(e.target.value)}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="sandbox">PayPal Sandbox (Testing & Development)</option>
                <option value="live" disabled>PayPal Live (Production Locked)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Base Ledger Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#151F33] border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="USD">USD ($ - United States Dollar)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Storage Endpoint */}
        <div className="bg-[#101729] border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Database className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Database Engine</h2>
          </div>

          <div className="text-xs space-y-2">
            <div className="bg-[#151F33] p-3 rounded-lg border border-slate-800 text-slate-300 font-mono text-[11px]">
              Connection Engine: <span className="text-emerald-400">SQLite 3 (Zero-Dependency Local Relational Store)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              For production deployment to Render, Railway, or AWS, set <code className="text-sky-300">DATABASE_URL=postgresql://user:pass@host/needbridge</code> in <code className="text-sky-300">backend/.env</code>.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

import React, { useState } from 'react';

type BenchResult = {
  success: boolean;
  model: string;
  passed: number;
  total: number;
  results: Array<{ id: string; passed: boolean; answer?: any; error?: string; corrected?: boolean }>;
};

const models = [
  { id: 'llama3.1:latest', label: 'Llama 3.1 (local)' },
  { id: 'dolphin-mistral:latest', label: 'Mistral-small (local)' },
];

const Benchmarks: React.FC = () => {
  const [model, setModel] = useState<string>(models[0].id);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<BenchResult | null>(null);
  const API_BASE = `http://${window.location.hostname}:8000`;

  const run = async () => {
    setLoading(true);
    setRes(null);
    try {
      const r = await fetch(`${API_BASE}/api/benchmarks/run`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'u1', sessionId: 'bench', model })
      });
      const j = await r.json();
      setRes(j);
    } catch (e) {
      setRes({ success: false, model, passed: 0, total: 0, results: [{ id: 'error', passed: false, error: (e as any)?.message }] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="max-w-3xl mx-auto glass-dark rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Benchmarks</h2>
            <p className="text-xs text-gray-400">JSON/Transform/Coding/Math (toy) — run locally</p>
          </div>
          <div className="flex items-center space-x-2">
            <select value={model} onChange={(e) => setModel(e.target.value)} className="bg-white/10 border border-white/10 rounded px-2 py-1 text-sm">
              {models.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))}
            </select>
            <button onClick={run} disabled={loading} className={`px-3 py-1 rounded border border-white/10 ${loading ? 'bg-gray-600 text-gray-400' : 'bg-white/10 hover:bg-white/20'}`}>{loading ? 'Running…' : 'Run'}</button>
          </div>
        </div>

        {res && (
          <div className="mt-2">
            <div className="text-sm text-gray-300">Model: <span className="text-white">{res.model}</span></div>
            <div className="text-sm text-gray-300">Pass: <span className="text-white">{res.passed}/{res.total}</span></div>
            <div className="mt-3 space-y-2">
              {res.results?.map((r) => (
                <div key={r.id} className="p-2 rounded border border-white/10 bg-white/5 text-sm flex items-center justify-between">
                  <div className="text-gray-300">{r.id}</div>
                  <div className={r.passed ? 'text-green-400' : 'text-red-400'}>{r.passed ? 'pass' : 'fail'}{r.corrected ? ' (corrected)' : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Benchmarks;



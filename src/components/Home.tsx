import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeProps {
  brainwaveMode: string;
}

type ResearchEntry = {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  impact: number;
  category: 'dataset' | 'timeline' | 'movement' | 'realization' | 'pattern' | 'language' | 'study' | 'other';
  tags: string[];
  sourceUrl?: string;
  verified: boolean;
};

type WidgetKey = 'collectiveSignal' | 'personalFeed' | 'newStudies' | 'aiSuggestions';

const API_BASE = (process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8000`).replace(/\/$/, '');

const DEFAULT_WIDGETS: WidgetKey[] = [
  'collectiveSignal',
  'personalFeed',
  'newStudies',
  'aiSuggestions'
];

const INTEREST_TAGS = [
  'quantum', 'neuroscience', 'complex-systems', 'linguistics', 'philosophy', 'astral', 'movement', 'ai-safety', 'kg', 'rag'
];

const getAnimationSpeed = (brainwaveMode: string) => {
  switch (brainwaveMode) {
    case 'delta': return 0.8;
    case 'theta': return 1.2;
    case 'alpha': return 1;
    case 'beta': return 1.5;
    case 'gamma': return 2;
    case 'emergence': return 2.5;
    default: return 1;
  }
};

const Home: React.FC<HomeProps> = ({ brainwaveMode }) => {
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('onboarding-complete') !== '1';
  });
  const [name, setName] = useState<string>('');
  const [interests, setInterests] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('onboarding-interests') || '[]');
    } catch { return []; }
  });
  const [defaultMode, setDefaultMode] = useState<string>(() => localStorage.getItem('onboarding-default-mode') || 'alpha');
  const [widgets, setWidgets] = useState<WidgetKey[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dashboard-widgets') || 'null');
      return Array.isArray(saved) && saved.length > 0 ? saved : DEFAULT_WIDGETS;
    } catch { return DEFAULT_WIDGETS; }
  });

  // Data sources
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const r = await fetch(`${API_BASE}/api/research/entries`);
        const j = await r.json();
        if (j?.entries) setEntries(j.entries);
      } catch (e: any) {
        setError('Failed to load feed');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const topTags = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => (e.tags || []).forEach((t) => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [entries]);

  // Handlers
  const toggleInterest = (tag: string) => {
    setInterests((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const finishOnboarding = () => {
    localStorage.setItem('onboarding-complete', '1');
    localStorage.setItem('onboarding-name', name || '');
    localStorage.setItem('onboarding-interests', JSON.stringify(interests));
    localStorage.setItem('onboarding-default-mode', defaultMode);
    setShowOnboarding(false);
  };

  const toggleWidget = (key: WidgetKey) => {
    setWidgets((prev) => {
      const exists = prev.includes(key);
      const next = exists ? prev.filter((w) => w !== key) : [...prev, key];
      localStorage.setItem('dashboard-widgets', JSON.stringify(next));
      return next;
    });
  };

  // Widgets
  const WidgetShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );

  const CollectiveSignal = () => (
    <WidgetShell title="Today’s Collective Signal">
      {isLoading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {topTags.length === 0 && (
              <span className="text-gray-400 text-sm">No tagged entries yet</span>
            )}
            {topTags.map(([tag, count]) => (
              <span key={tag} className="text-xs bg-white/5 border border-white/10 text-white/90 px-2 py-0.5 rounded">#{tag} ({count})</span>
            ))}
          </div>
          <div className="text-xs text-gray-400">Signal updates as research entries change.</div>
        </div>
      )}
    </WidgetShell>
  );

  const PersonalFeed = () => (
    <WidgetShell title="Personal Feed">
      {isLoading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : entries.length === 0 ? (
        <div className="text-sm text-gray-400">No entries yet. Share in Research Feed.</div>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 3).map((e) => (
            <div key={e.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                <span>{e.author}</span>
                <span>•</span>
                <span>{new Date(e.timestamp).toLocaleString()}</span>
              </div>
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-gray-200 line-clamp-3">{e.content}</div>
            </div>
          ))}
        </div>
      )}
    </WidgetShell>
  );

  const NewStudies = () => (
    <WidgetShell title="Fresh research">
      <div className="text-sm text-gray-300 space-y-2">
        <div>
          <a className="underline" href="https://arxiv.org/list/q-bio.NC/recent" target="_blank" rel="noopener noreferrer">arXiv · Neural & Cognitive</a>
        </div>
        <div>
          <a className="underline" href="https://arxiv.org/list/quant-ph/recent" target="_blank" rel="noopener noreferrer">arXiv · Quantum Physics</a>
        </div>
        <div>
          <a className="underline" href="https://www.nature.com/search?q=consciousness" target="_blank" rel="noopener noreferrer">Nature · Consciousness</a>
        </div>
        <div className="text-xs text-gray-400">This feed can later use backend curation.</div>
      </div>
    </WidgetShell>
  );

  const AISuggestions = () => (
    <WidgetShell title="AI Suggestions (beta)">
      <div className="text-sm text-gray-300">
        Personalized suggestions will appear here based on selected interests and collective signals. Integration can call /api/thesidia/process or /api/chat/stream.
      </div>
    </WidgetShell>
  );

  return (
    <div className="w-full h-full bg-black text-white p-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl glass-dark mb-8">
        <div className="absolute inset-0 opacity-30 pointer-events-none hero-neon-bg" />
        <div className="p-6 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 badge-neon px-3 py-1 rounded-full text-xs mb-3">
                <span>SpiritLink.Space</span>
                <span>•</span>
                <span>Journey + Modules</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold title-gradient">Simple tools for deep work</h1>
              <p className="mt-3 text-sm md:text-base text-gray-300 max-w-xl">Learn, move, make, and share. Use clear signals, smart models, and calm visuals to explore ideas without noise.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => setShowOnboarding(true)} className="btn-neon px-4 py-2 rounded-lg text-sm font-semibold">Get Started</button>
                <button onClick={() => setShowHowItWorks(true)} className="glass-button px-4 py-2 rounded-lg text-sm">How it works</button>
              </div>
            </div>
            <div className="flex-1 w-full">
              {/* System overview mini-graph */}
              <div className="neon-outline rounded-2xl p-4">
                <div className="grid grid-cols-3 gap-3 text-xs text-gray-300">
                  <div className="p-3 glass-card rounded-lg"><div className="text-white font-semibold">Signals</div><div className="text-gray-400">Trends that matter</div></div>
                  <div className="p-3 glass-card rounded-lg"><div className="text-white font-semibold">Thesidia</div><div className="text-gray-400">Ask. Compare. Clarify.</div></div>
                  <div className="p-3 glass-card rounded-lg"><div className="text-white font-semibold">Movement</div><div className="text-gray-400">Create through motion</div></div>
                  <div className="p-3 glass-card rounded-lg"><div className="text-white font-semibold">Synthesis</div><div className="text-gray-400">Pull ideas together</div></div>
                  <div className="p-3 glass-card rounded-lg"><div className="text-white font-semibold">Patterns</div><div className="text-gray-400">See connections</div></div>
                  <div className="p-3 glass-card rounded-lg"><div className="text-white font-semibold">Sharing</div><div className="text-gray-400">Friends & teams</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {widgets.includes('collectiveSignal') && <CollectiveSignal />}
        {widgets.includes('personalFeed') && <PersonalFeed />}
        {widgets.includes('newStudies') && <NewStudies />}
        {widgets.includes('aiSuggestions') && <AISuggestions />}
      </div>

      {/* Onboarding Wizard */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="glass-dark rounded-2xl p-6 w-full max-w-2xl"
            >
              {/* wizard */}
              <Wizard
                name={name}
                setName={setName}
                interests={interests}
                toggleInterest={toggleInterest}
                defaultMode={defaultMode}
                setDefaultMode={setDefaultMode}
                widgets={widgets}
                toggleWidget={toggleWidget}
                onClose={() => setShowOnboarding(false)}
                onFinish={finishOnboarding}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

// Wizard component (multi-step with account fields)
const Wizard: React.FC<{
  name: string;
  setName: (s: string) => void;
  interests: string[];
  toggleInterest: (s: string) => void;
  defaultMode: string;
  setDefaultMode: (s: string) => void;
  widgets: WidgetKey[];
  toggleWidget: (w: WidgetKey) => void;
  onClose: () => void;
  onFinish: () => void;
}> = ({ name, setName, interests, toggleInterest, defaultMode, setDefaultMode, widgets, toggleWidget, onClose, onFinish }) => {
  const [step, setStep] = useState<number>(0);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const steps = [
    'Welcome',
    'Account',
    'Interests',
    'Modes',
    'Widgets'
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{steps[step]}</h2>
          <p className="text-xs text-gray-400">Step {step + 1} of {steps.length}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="space-y-5">
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-300">Personalize SpiritLink.Space for a luminous research experience. Nothing is default—every element is tuned to your intent.</p>
            <div>
              <label className="text-sm text-gray-300">Display name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="w-full mt-1 glass-input rounded-md px-3 py-2 text-white placeholder-gray-500" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" className="w-full mt-1 glass-input rounded-md px-3 py-2 text-white placeholder-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" className="w-full mt-1 glass-input rounded-md px-3 py-2 text-white placeholder-gray-500" />
            </div>
            <div className="md:col-span-2 text-xs text-gray-400">Account creation is local-first for now; can connect to backend auth later.</div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="text-sm text-gray-300">Interests</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const active = interests.includes(tag);
                return (
                  <button key={tag} onClick={() => toggleInterest(tag)} className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>{active ? '✓ ' : ''}{tag}</button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="text-sm text-gray-300">Default brainwave mode</label>
            <select aria-label="Default brainwave mode" value={defaultMode} onChange={(e) => setDefaultMode(e.target.value)} className="w-full mt-1 glass-input rounded-md px-3 py-2 text-white">
              {['delta','theta','alpha','beta','gamma','emergence'].map((m) => (<option value={m} key={m}>{m}</option>))}
            </select>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="text-sm text-gray-300">Dashboard widgets</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {([
                ['collectiveSignal','Collective signal'],
                ['personalFeed','Personal feed'],
                ['newStudies','New studies'],
                ['aiSuggestions','AI suggestions']
              ] as Array<[WidgetKey, string]>).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-md px-3 py-2">
                  <input type="checkbox" checked={widgets.includes(key as WidgetKey)} onChange={() => toggleWidget(key as WidgetKey)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <button onClick={onClose} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm">Close</button>
          <div className="flex items-center gap-2">
            <button disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))} className={`px-3 py-2 rounded-lg text-sm ${step === 0 ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed' : 'glass-button'}`}>Back</button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="btn-neon px-4 py-2 rounded-lg text-sm font-semibold">Next</button>
            ) : (
              <button onClick={onFinish} className="btn-neon px-4 py-2 rounded-lg text-sm font-semibold">Finish</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



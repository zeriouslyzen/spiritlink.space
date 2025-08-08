import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchFeedProps {
  brainwaveMode: string;
}

interface ResearchEntry {
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
}

const API_BASE = (process.env.REACT_APP_API_BASE || `http://${window.location.hostname}:8000`).replace(/\/$/, '');

const ResearchFeed: React.FC<ResearchFeedProps> = ({ brainwaveMode }) => {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ResearchEntry['category']>('other');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState<string>('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/api/research/entries`);
        const j = await r.json();
        if (j?.entries) setEntries(j.entries);
      } catch {}
    })();
  }, []);

  const getAnimationSpeed = () => {
    switch (brainwaveMode) {
      case 'delta': return 0.8;
      case 'theta': return 1.2;
      case 'alpha': return 1;
      case 'beta': return 1.5;
      case 'gamma': return 2;
      default: return 1;
    }
  };

  const handlePost = async () => {
    if (!newEntry.trim() || !title.trim()) return;
    
    setIsPosting(true);
    
    try {
      const resp = await fetch(`${API_BASE}/api/research/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: newEntry.trim(),
          author: 'You',
          impact: Math.floor(Math.random() * 20) + 80,
          category,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          sourceUrl: sourceUrl.trim() || undefined
        })
      });
      const json = await resp.json();
      if (json?.entry) setEntries([json.entry, ...entries]);
      setTitle('');
      setNewEntry('');
      setCategory('other');
      setTags('');
      setSourceUrl('');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full h-full bg-black text-white p-6">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="glass-dark rounded-2xl p-6 mb-6 flex-shrink-0">
          <motion.h1 
            className="text-2xl font-bold mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Research Feed
          </motion.h1>
          <p className="text-gray-400 text-sm">Collective consciousness evolution in real-time</p>
        </div>

        {/* Post Creation */}
        <div className="glass-card rounded-2xl p-6 mb-6 flex-shrink-0">
          <motion.div 
            className="space-y-4"
            animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (succinct)"
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white">
                  <option value="dataset">Dataset</option>
                  <option value="timeline">Timeline</option>
                  <option value="movement">Movement</option>
                  <option value="realization">Realization</option>
                  <option value="pattern">Pattern</option>
                  <option value="language">Language</option>
                  <option value="study">Study</option>
                  <option value="other">Other</option>
                </select>
                <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags (comma-separated)" className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-500" />
                <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="source URL (optional)" className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-500" />
              </div>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Abstract / findings / protocol..."
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-500 resize-none outline-none min-h-[120px]"
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="text-xs text-gray-400">Draft impact estimate: {newEntry.length > 0 ? Math.floor(Math.random() * 20) + 80 : 0}%</span>
              </div>
              
              <motion.button
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  newEntry.trim() && !isPosting
                    ? 'glass-button text-white hover:glass-medium' 
                    : 'glass-input text-gray-400'
                }`}
                onClick={handlePost}
                disabled={!newEntry.trim() || isPosting}
                whileHover={newEntry.trim() && !isPosting ? { scale: 1.05 } : {}}
                whileTap={newEntry.trim() && !isPosting ? { scale: 0.95 } : {}}
              >
                {isPosting ? 'Posting...' : 'Share Research'}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Research Entries */}
        <div className="flex-1 overflow-y-auto space-y-4">
          <AnimatePresence>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1
                }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="font-semibold text-white">{entry.author}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{new Date(entry.timestamp).toLocaleString()}</span>
                      {entry.verified && (
                        <span className="text-xs bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full">verified</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{entry.title}</h3>
                    
                    <p className="text-white/90 mb-3 leading-relaxed">{entry.content}</p>
                    <div className="flex items-center flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-white/5 border border-white/10 text-white px-2 py-0.5 rounded">{entry.category}</span>
                      {entry.tags?.map((t) => (
                        <span key={t} className="text-xs bg-white/5 border border-white/10 text-white/90 px-2 py-0.5 rounded">#{t}</span>
                      ))}
                      {entry.sourceUrl && (
                        <a href={entry.sourceUrl} target="_blank" rel="noreferrer" className="text-xs underline text-gray-300">source</a>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">impact: <span className="text-white font-semibold">{entry.impact}%</span></div>
                      {entry.verified ? (
                        <span className="text-xs text-green-400">✓ verification passed</span>
                      ) : (
                        <span className="text-xs text-yellow-300">pending verification</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ResearchFeed;
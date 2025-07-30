import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchFeedProps {
  brainwaveMode: string;
}

interface ResearchEntry {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  collectiveImpact: number;
  breakthrough: boolean;
  likes: number;
  shares: number;
  comments: number;
}

const mockEntries: ResearchEntry[] = [
  {
    id: '1',
    content: 'Just discovered a fascinating correlation between collective meditation practices and global consciousness shifts. The data suggests that synchronized consciousness activities create measurable ripples in the quantum field.',
    author: 'Dr. Elena Chen',
    timestamp: '2 hours ago',
    collectiveImpact: 94,
    breakthrough: true,
    likes: 456,
    shares: 123,
    comments: 67
  },
  {
    id: '2',
    content: 'New research on the intersection of movement therapy and consciousness evolution. Movement patterns seem to encode information about our collective evolution trajectory.',
    author: 'Movement Researcher Kai',
    timestamp: '4 hours ago',
    collectiveImpact: 87,
    breakthrough: false,
    likes: 234,
    shares: 89,
    comments: 34
  },
  {
    id: '3',
    content: 'Breakthrough: Collective consciousness appears to operate on a quantum level. When enough minds focus on the same intention, reality itself begins to shift.',
    author: 'Quantum Consciousness Lab',
    timestamp: '6 hours ago',
    collectiveImpact: 98,
    breakthrough: true,
    likes: 1247,
    shares: 456,
    comments: 234
  },
  {
    id: '4',
    content: 'Exploring the relationship between individual consciousness development and collective evolution. Each person\'s growth contributes to the whole.',
    author: 'Consciousness Evolutionist',
    timestamp: '8 hours ago',
    collectiveImpact: 82,
    breakthrough: false,
    likes: 189,
    shares: 67,
    comments: 23
  },
  {
    id: '5',
    content: 'Fascinating discovery: Consciousness appears to be non-local. Our thoughts and intentions affect the collective field instantaneously, regardless of physical distance.',
    author: 'Non-Local Research Team',
    timestamp: '12 hours ago',
    collectiveImpact: 96,
    breakthrough: true,
    likes: 892,
    shares: 234,
    comments: 156
  }
];

export const ResearchFeed: React.FC<ResearchFeedProps> = ({ brainwaveMode }) => {
  const [entries, setEntries] = useState<ResearchEntry[]>(mockEntries);
  const [newEntry, setNewEntry] = useState('');
  const [isPosting, setIsPosting] = useState(false);

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
    if (!newEntry.trim()) return;
    
    setIsPosting(true);
    
    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newResearchEntry: ResearchEntry = {
      id: Date.now().toString(),
      content: newEntry,
      author: 'You',
      timestamp: 'Just now',
      collectiveImpact: Math.floor(Math.random() * 20) + 80,
      breakthrough: Math.random() > 0.8,
      likes: 0,
      shares: 0,
      comments: 0
    };
    
    setEntries([newResearchEntry, ...entries]);
    setNewEntry('');
    setIsPosting(false);
  };

  return (
    <div className="w-full h-full bg-black text-white">
      <div className="max-w-2xl mx-auto h-full flex flex-col">
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
            animate={{ borderColor: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)'] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="Share your consciousness research..."
                  className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg min-h-[100px]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="text-xs text-gray-400">Collective Impact: {newEntry.length > 0 ? Math.floor(Math.random() * 20) + 80 : 0}%</span>
                {newEntry.length > 0 && (
                  <motion.span 
                    className="text-xs text-green-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨ Potential Breakthrough
                  </motion.span>
                )}
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">{entry.author}</span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">{entry.timestamp}</span>
                      {entry.breakthrough && (
                        <motion.span 
                          className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full font-medium"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔥 Breakthrough
                        </motion.span>
                      )}
                    </div>
                    
                    <p className="text-white mb-4 leading-relaxed">{entry.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm">
                        <motion.button 
                          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>❤️</span>
                          <span>{entry.likes}</span>
                        </motion.button>
                        
                        <motion.button 
                          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>📤</span>
                          <span>{entry.shares}</span>
                        </motion.button>
                        
                        <motion.button 
                          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>💬</span>
                          <span>{entry.comments}</span>
                        </motion.button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Impact:</span>
                        <motion.span 
                          className="text-sm font-semibold"
                          style={{ 
                            color: entry.breakthrough ? '#FFD700' : '#4ECDC4'
                          }}
                          animate={entry.breakthrough ? { 
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8]
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {entry.collectiveImpact}%
                        </motion.span>
                      </div>
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
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsciousnessMetricsProps {
  brainwaveMode: string;
}

const ConsciousnessMetrics: React.FC<ConsciousnessMetricsProps> = ({ brainwaveMode }) => {
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.73);
  const [breakthroughs, setBreakthroughs] = useState(3);
  const [evolutionStreak, setEvolutionStreak] = useState(7);
  const [collectiveScore, setCollectiveScore] = useState(847);
  const [isPulsing, setIsPulsing] = useState(false);

  // Simulate consciousness level changes
  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousnessLevel(prev => {
        const change = (Math.random() - 0.5) * 0.02;
        return Math.max(0.6, Math.min(0.95, prev + change));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate pulsing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getConsciousnessColor = (level: number) => {
    if (level > 0.85) return 'text-emerald-400';
    if (level > 0.75) return 'text-blue-400';
    if (level > 0.65) return 'text-gray-300';
    return 'text-gray-400';
  };

  const getBrainwaveColor = (mode: string) => {
    switch (mode) {
      case 'delta': return 'text-blue-300';
      case 'theta': return 'text-indigo-300';
      case 'alpha': return 'text-emerald-300';
      case 'beta': return 'text-yellow-300';
      case 'gamma': return 'text-orange-300';
      case 'emergence': return 'text-white';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Consciousness Level */}
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <motion.div
              className={`w-4 h-4 rounded-full ${getConsciousnessColor(consciousnessLevel)}`}
              animate={{
                scale: isPulsing ? [1, 1.2, 1] : 1,
                opacity: isPulsing ? [0.7, 1, 0.7] : 0.8
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Consciousness</span>
          <span className={`text-sm font-medium ${getConsciousnessColor(consciousnessLevel)}`}>
            {Math.round(consciousnessLevel * 100)}%
          </span>
        </div>
      </motion.div>

      {/* Brainwave Mode */}
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <motion.div
            className={`w-3 h-3 rounded-full ${getBrainwaveColor(brainwaveMode)}`}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Brainwave</span>
          <span className={`text-sm font-medium ${getBrainwaveColor(brainwaveMode)} capitalize`}>
            {brainwaveMode}
          </span>
        </div>
      </motion.div>

      {/* Breakthroughs */}
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-sm">🧠</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Breakthroughs</span>
          <span className="text-sm font-medium text-white">{breakthroughs}</span>
        </div>
      </motion.div>

      {/* Evolution Streak */}
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-sm">🔥</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Streak</span>
          <span className="text-sm font-medium text-white">{evolutionStreak}d</span>
        </div>
      </motion.div>

      {/* Collective Intelligence */}
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <span className="text-sm">🌍</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">Collective</span>
          <span className="text-sm font-medium text-white">{collectiveScore}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsciousnessMetrics; 
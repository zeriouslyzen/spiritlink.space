import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BrainwaveMode = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'emergence';

interface BrainwaveSelectorProps {
  currentMode: BrainwaveMode;
  onModeChange: (mode: BrainwaveMode) => void;
}

const BRAINWAVE_MODES = [
  {
    id: 'delta',
    name: 'Delta',
    description: 'Deep Reflection',
    color: 'from-purple-600 to-indigo-600',
    icon: '🌊',
    frequency: '0.5-4 Hz'
  },
  {
    id: 'theta',
    name: 'Theta',
    description: 'Creativity & Intuition',
    color: 'from-blue-500 to-purple-500',
    icon: '🎨',
    frequency: '4-8 Hz'
  },
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Relaxed Awareness',
    color: 'from-green-500 to-blue-500',
    icon: '🧘',
    frequency: '8-13 Hz'
  },
  {
    id: 'beta',
    name: 'Beta',
    description: 'Active Thinking',
    color: 'from-yellow-500 to-green-500',
    icon: '⚡',
    frequency: '13-30 Hz'
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'Peak Cognition',
    color: 'from-red-500 to-pink-500',
    icon: '🌟',
    frequency: '30-100 Hz'
  },
  {
    id: 'emergence',
    name: 'Emergence',
    description: 'Breakthrough Consciousness',
    color: 'from-indigo-500 to-purple-500',
    icon: '🌀',
    frequency: 'Variable'
  }
];

export const BrainwaveSelector: React.FC<BrainwaveSelectorProps> = ({ currentMode, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentBrainwaveMode = BRAINWAVE_MODES.find(mode => mode.id === currentMode) || BRAINWAVE_MODES[2];

  return (
    <div className="relative">
      {/* Current Mode Display */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 rounded-lg bg-gradient-to-r ${currentBrainwaveMode.color} text-white font-medium flex items-center justify-between transition-all duration-300 hover:scale-105`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentBrainwaveMode.icon}</span>
          <div className="text-left">
            <div className="font-semibold">{currentBrainwaveMode.name}</div>
            <div className="text-xs opacity-90">{currentBrainwaveMode.description}</div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white"
        >
          ▼
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg rounded-lg border border-gray-700 shadow-2xl z-50 overflow-hidden"
          >
            {BRAINWAVE_MODES.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => {
                  onModeChange(mode.id as BrainwaveMode);
                  setIsOpen(false);
                }}
                className={`w-full p-4 text-left hover:bg-white/10 transition-colors duration-200 flex items-center space-x-3 ${
                  currentMode === mode.id ? 'bg-white/20' : ''
                }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-xl">{mode.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-white">{mode.name}</div>
                  <div className="text-sm text-gray-400">{mode.description}</div>
                  <div className="text-xs text-gray-500">{mode.frequency}</div>
                </div>
                {currentMode === mode.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 
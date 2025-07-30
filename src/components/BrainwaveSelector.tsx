import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type BrainwaveMode = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

interface BrainwaveSelectorProps {
  currentMode: BrainwaveMode;
  onModeChange: (mode: BrainwaveMode) => void;
}

const brainwaveModes = [
  { id: 'delta', name: 'Delta', description: 'Deep reflection', frequency: '<4 Hz' },
  { id: 'theta', name: 'Theta', description: 'Creativity & intuition', frequency: '4-8 Hz' },
  { id: 'alpha', name: 'Alpha', description: 'Relaxed & calm', frequency: '8-12 Hz' },
  { id: 'beta', name: 'Beta', description: 'Active thinking', frequency: '13-30 Hz' },
  { id: 'gamma', name: 'Gamma', description: 'Peak cognition', frequency: '>30 Hz' }
];

export const BrainwaveSelector: React.FC<BrainwaveSelectorProps> = ({
  currentMode,
  onModeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getModeAnimation = (mode: BrainwaveMode) => {
    switch (mode) {
      case 'delta':
        return { scale: 0.8, opacity: 0.6, filter: 'blur(1px)' };
      case 'theta':
        return { scale: 1.1, opacity: 0.8, filter: 'blur(0.5px)' };
      case 'alpha':
        return { scale: 1, opacity: 1, filter: 'blur(0px)' };
      case 'beta':
        return { scale: 1.05, opacity: 1, filter: 'blur(0px)' };
      case 'gamma':
        return { scale: 1.2, opacity: 1, filter: 'blur(0px)' };
      default:
        return { scale: 1, opacity: 1, filter: 'blur(0px)' };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Main Selector Button */}
      <motion.button
        className="relative w-16 h-16 bg-black border-2 border-white rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={getModeAnimation(currentMode)}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 bg-white rounded-full opacity-80" />
        
        {/* Breathing Animation */}
        <motion.div
          className="absolute inset-0 border-2 border-white rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-20 right-0 bg-black border border-white rounded-lg p-2 min-w-48"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {brainwaveModes.map((mode) => (
              <motion.button
                key={mode.id}
                className={`w-full text-left p-3 rounded-md mb-1 transition-colors ${
                  currentMode === mode.id 
                    ? 'bg-white text-black' 
                    : 'text-white hover:bg-gray-900'
                }`}
                onClick={() => {
                  onModeChange(mode.id as BrainwaveMode);
                  setIsOpen(false);
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-sm opacity-70">{mode.description}</div>
                  </div>
                  <div className="text-xs opacity-50">{mode.frequency}</div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 
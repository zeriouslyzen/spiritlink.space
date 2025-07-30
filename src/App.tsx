import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainwaveSelector, BrainwaveMode } from './components/BrainwaveSelector';
import { Navigation } from './components/Navigation';
import { MovementLab } from './components/MovementLab';
import { ResearchFeed } from './components/ResearchFeed';
import { ThesidiaAI } from './components/ThesidiaAI';

function App() {
  const [brainwaveMode, setBrainwaveMode] = useState<BrainwaveMode>('alpha');
  const [currentSection, setCurrentSection] = useState('movement-lab');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'movement-lab':
        return <MovementLab brainwaveMode={brainwaveMode} />;
      case 'research-feed':
        return <ResearchFeed brainwaveMode={brainwaveMode} />;
      case 'thesidia-ai':
        return <ThesidiaAI brainwaveMode={brainwaveMode} />;
      case 'broadcast':
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Broadcast System</h1>
              <p className="text-gray-400">Live consciousness sharing coming soon...</p>
            </motion.div>
          </div>
        );
      case 'courses':
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Consciousness Courses</h1>
              <p className="text-gray-400">Structured learning paths coming soon...</p>
            </motion.div>
          </div>
        );
      case 'collective-intelligence':
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Collective Intelligence</h1>
              <p className="text-gray-400">AI-powered pattern recognition coming soon...</p>
            </motion.div>
          </div>
        );
      case 'research-journal':
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-4">Research Journal</h1>
              <p className="text-gray-400">Personal consciousness documentation coming soon...</p>
            </motion.div>
          </div>
        );
      default:
        return <MovementLab brainwaveMode={brainwaveMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        brainwaveMode={brainwaveMode}
        onCollapseChange={setIsNavCollapsed}
      />

      {/* Brainwave Selector */}
      <BrainwaveSelector
        currentMode={brainwaveMode}
        onModeChange={setBrainwaveMode}
      />

      {/* Main Content - Dynamic positioning */}
      <motion.div 
        className="min-h-screen"
        animate={{ 
          marginLeft: isNavCollapsed ? '64px' : '256px'
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderCurrentSection()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Global Breathing Animation */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: brainwaveMode === 'delta' 
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 70%)'
            : brainwaveMode === 'theta'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)'
            : brainwaveMode === 'alpha'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.01) 0%, transparent 70%)'
            : brainwaveMode === 'beta'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.005) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(255,255,255,0.01) 0%, transparent 70%)'
        }}
        transition={{ duration: 2 }}
      />
    </div>
  );
}

export default App; 
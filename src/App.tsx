import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from './components/Navigation';
import { BrainwaveMode } from './types/brainwaves';

// Lazy load all components for better performance
const ThesidiaAI = lazy(() => import('./components/ThesidiaAI'));
const CollectiveIntelligence = lazy(() => import('./components/CollectiveIntelligence'));
const ResearchFeed = lazy(() => import('./components/ResearchFeed'));
const MovementLab = lazy(() => import('./components/MovementLab'));

// Loading component for lazy loaded components
const LoadingSpinner = () => (
  <div className="w-full h-full bg-black text-white flex items-center justify-center">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Loading consciousness interface...</p>
    </motion.div>
  </div>
);

function App() {
  const [brainwaveMode, setBrainwaveMode] = useState<BrainwaveMode>('alpha');
  const [currentSection, setCurrentSection] = useState('thesidia-ai');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'movement-lab':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <MovementLab brainwaveMode={brainwaveMode} />
          </Suspense>
        );
      case 'research-feed':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ResearchFeed brainwaveMode={brainwaveMode} />
          </Suspense>
        );
      case 'thesidia-ai':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ThesidiaAI brainwaveMode={brainwaveMode} />
          </Suspense>
        );
      case 'collective-intelligence':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <CollectiveIntelligence brainwaveMode={brainwaveMode} />
          </Suspense>
        );
      case 'broadcast':
        return (
          <div className="w-full h-full bg-black text-white p-6">
            <div className="h-full flex items-center justify-center">
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
          </div>
        );
      // 'courses' route removed
      case 'research-journal':
        return (
          <div className="w-full h-full bg-black text-white p-6">
            <div className="h-full flex items-center justify-center">
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
          </div>
        );
      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ThesidiaAI brainwaveMode={brainwaveMode} />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        brainwaveMode={brainwaveMode}
        onBrainwaveChange={(brainwave: string) => setBrainwaveMode(brainwave as BrainwaveMode)}
        onCollapseChange={setIsNavCollapsed}
      />

      {/* Main Content - Dynamic positioning */}
      <motion.div 
        className="min-h-screen"
        animate={{ 
          marginLeft: isNavCollapsed ? '64px' : '256px'
        }}
        initial={{ marginLeft: '64px' }}
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
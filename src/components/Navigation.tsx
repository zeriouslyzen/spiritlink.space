import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  brainwaveMode: string;
  onCollapseChange?: (collapsed: boolean) => void;
}

const navigationItems = [
  {
    id: 'movement-lab',
    name: 'Movement Lab',
    icon: '🜁', // Fire - energy and movement
    description: 'Express consciousness through movement',
    color: 'from-purple-500 to-pink-500',
    symbolColor: '#FF6B9D'
  },
  {
    id: 'research-feed',
    name: 'Research Feed',
    icon: '🜂', // Water - flow and knowledge
    description: 'Collective consciousness evolution',
    color: 'from-blue-500 to-cyan-500',
    symbolColor: '#4ECDC4'
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    icon: '🜄', // Air - communication and transmission
    description: 'Live consciousness sharing',
    color: 'from-green-500 to-emerald-500',
    symbolColor: '#45B7D1'
  },
  {
    id: 'courses',
    name: 'Courses',
    icon: '🜃', // Earth - structure and foundation
    description: 'Structured consciousness learning',
    color: 'from-yellow-500 to-orange-500',
    symbolColor: '#96CEB4'
  },
  {
    id: 'thesidia-ai',
    name: 'Thesidia AI',
    icon: '⚡', // Lightning - intelligence and power
    description: 'AI-powered consciousness assistant',
    color: 'from-indigo-500 to-purple-500',
    symbolColor: '#A855F7'
  },
  {
    id: 'collective-intelligence',
    name: 'Collective Intelligence',
    icon: '🜁', // Fire - wisdom and consciousness
    description: 'AI-powered pattern recognition',
    color: 'from-red-500 to-pink-500',
    symbolColor: '#FFEAA7'
  },
  {
    id: 'research-journal',
    name: 'Research Journal',
    icon: '🜂', // Water - thought and documentation
    description: 'Personal consciousness documentation',
    color: 'from-indigo-500 to-purple-500',
    symbolColor: '#DDA0DD'
  }
];

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSectionChange,
  brainwaveMode,
  onCollapseChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  return (
    <div className="fixed left-0 top-0 h-full z-40">
      <motion.div
        className={`h-full transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)'
        }}
        animate={{ 
          width: isCollapsed ? 64 : 256,
          opacity: [0.9, 1, 0.9]
        }}
        transition={{ 
          duration: 0.3,
          opacity: { duration: 3, repeat: Infinity }
        }}
      >
        {/* Header */}
        <div 
          className="p-4 border-b border-white/10 flex-shrink-0"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-xl font-bold text-white">SpiritLink OS</h1>
                <p className="text-xs text-gray-400">Consciousness Evolution Platform</p>
              </motion.div>
            )}
            <motion.button
              className="p-2 rounded-lg transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onClick={handleCollapseToggle}
              whileHover={{ 
                scale: 1.05,
                background: 'rgba(255, 255, 255, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-lg">
                {isCollapsed ? '→' : '←'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Navigation Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {navigationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  currentSection === item.id
                    ? 'text-black'
                    : 'text-white hover:text-white'
                }`}
                style={{
                  background: currentSection === item.id 
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: currentSection === item.id
                    ? '1px solid rgba(255, 255, 255, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => onSectionChange(item.id)}
                whileHover={{ 
                  x: 4,
                  background: currentSection === item.id
                    ? 'rgba(255, 255, 255, 0.95)'
                    : 'rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
                animate={currentSection === item.id ? {
                  scale: [1, 1.02, 1],
                  opacity: [0.9, 1, 0.9]
                } : {}}
                transition={{ 
                  duration: 2 * getAnimationSpeed(),
                  repeat: currentSection === item.id ? Infinity : 0
                }}
              >
                <motion.div 
                  className="text-3xl"
                  style={{ color: item.symbolColor }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {item.icon}
                </motion.div>
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div 
          className="p-4 border-t border-white/10 flex-shrink-0"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="space-y-3">
                {/* Collective Activity */}
                <div 
                  className="rounded-lg p-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Collective Activity</span>
                    <span className="text-white font-semibold">87%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                    <motion.div
                      className="bg-white h-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '87%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Breakthrough Alert */}
                <motion.div
                  className="rounded-lg p-3"
                  style={{
                    background: 'rgba(255, 193, 7, 0.2)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 193, 7, 0.3)'
                  }}
                  animate={{ 
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🔥</span>
                    <div className="text-sm">
                      <div className="font-semibold text-white">Breakthrough Detected</div>
                      <div className="text-xs opacity-90 text-white">1,247 users synchronized</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}; 
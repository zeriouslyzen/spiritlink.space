import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  brainwaveMode: string;
  onBrainwaveChange: (brainwave: string) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  theme?: 'dark' | 'epaper';
  onThemeChange?: (t: 'dark' | 'epaper') => void;
}

const navigationItems = [
  {
    id: 'home',
    name: 'Home',
    icon: '⚗', // Alchemical flask - entry point
    description: 'Onboarding & personal dashboard',
    color: 'from-violet-500 to-indigo-500',
    symbolColor: '#A78BFA'
  },
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

const BRAINWAVE_MODES = [
  {
    id: 'delta',
    name: 'Delta',
    description: 'Deep Reflection',
    color: 'from-purple-600 to-indigo-600',
    icon: '💤',
    frequency: '0.5-4 Hz'
  },
  {
    id: 'theta',
    name: 'Theta',
    description: 'Creativity & Intuition',
    color: 'from-blue-500 to-purple-500',
    icon: '🌊',
    frequency: '4-8 Hz'
  },
  {
    id: 'alpha',
    name: 'Alpha',
    description: 'Relaxed Awareness',
    color: 'from-green-500 to-blue-500',
    icon: '🌿',
    frequency: '8-13 Hz'
  },
  {
    id: 'beta',
    name: 'Beta',
    description: 'Active Thinking',
    color: 'from-yellow-500 to-green-500',
    icon: '🔧',
    frequency: '13-30 Hz'
  },
  {
    id: 'gamma',
    name: 'Gamma',
    description: 'Peak Cognition',
    color: 'from-pink-500 to-purple-500',
    icon: '✨',
    frequency: '30-100 Hz'
  },
  {
    id: 'emergence',
    name: 'Emergence',
    description: 'Breakthrough Consciousness',
    color: 'from-indigo-600 to-purple-800',
    icon: '🌀',
    frequency: '100+ Hz'
  }
];

export const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  onSectionChange,
  brainwaveMode,
  onBrainwaveChange,
  onCollapseChange,
  theme = 'dark',
  onThemeChange
}) => {
  // Start collapsed to match App.tsx initial margin-left (prevents overlay on load)
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const closeTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);

  const getAnimationSpeed = () => {
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

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange?.(newCollapsedState);
  };

  // Detect mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Intent-based auto open/close via edge hover (desktop only)
  const scheduleClose = (delay = 400) => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsCollapsed(true);
      onCollapseChange?.(true);
    }, delay);
  };
  const scheduleOpen = (delay = 120) => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      setIsCollapsed(false);
      onCollapseChange?.(false);
    }, delay);
  };

  const currentBrainwaveMode = BRAINWAVE_MODES.find(mode => mode.id === brainwaveMode) || BRAINWAVE_MODES[2];

  const BrainwaveIcon: React.FC<{ id: string; className?: string; style?: React.CSSProperties }> = ({ id, className, style }) => {
    const common = 'w-5 h-5';
    const cls = `${common} ${className || ''}`.trim();
    switch (id) {
      case 'delta':
        return (
          <svg className={cls} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 15c2 2 4 3 8 3s6-1 8-3" strokeLinecap="round" />
            <path d="M6 12c1.5 1.5 3 2 6 2s4.5-.5 6-2" strokeLinecap="round" />
            <path d="M8 9c1 .8 2 1 4 1s3-.2 4-1" strokeLinecap="round" />
          </svg>
        );
      case 'theta':
        return (
          <svg className={cls} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12h18" strokeLinecap="round" />
            <path d="M12 3c-3 3-3 15 0 18" />
            <path d="M12 3c3 3 3 15 0 18" />
          </svg>
        );
      case 'alpha':
        return (
          <svg className={cls} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="6" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
          </svg>
        );
      case 'beta':
        return (
          <svg className={cls} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12h6a4 4 0 110 8H4z" />
            <path d="M4 4h7a3.5 3.5 0 110 7H4z" />
          </svg>
        );
      case 'gamma':
        return (
          <svg className={cls} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2l2.5 5 5.5.5-4 3.5 1.2 5.5L12 14l-5.2 2.5 1.2-5.5-4-3.5 5.5-.5z" />
          </svg>
        );
      case 'emergence':
      default:
        return (
          <svg className={cls} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4a8 8 0 100 16 8 8 0 000-16z" />
            <path d="M12 4c3 3 3 13 0 16M12 4C9 7 9 17 12 20" />
          </svg>
        );
    }
  };

  const modeIndex = useMemo(() => BRAINWAVE_MODES.findIndex((m) => m.id === brainwaveMode), [brainwaveMode]);

  const getModeColor = (id: string) => {
    switch (id) {
      case 'delta': return '#60A5FA'; // blue-400
      case 'theta': return '#22D3EE'; // cyan-400
      case 'alpha': return '#34D399'; // emerald-400
      case 'beta': return '#F59E0B'; // amber-500
      case 'gamma': return '#A78BFA'; // violet-400
      case 'emergence': default: return '#F472B6'; // pink-400
    }
  };

  return (
    <div
      className="fixed left-0 top-0 h-full z-40"
      onMouseEnter={() => {
        if (!isMobile) scheduleOpen(80);
      }}
      onMouseLeave={() => {
        if (!isMobile) scheduleClose(300);
      }}
    >
      <motion.div
        className={`h-full transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isMobile ? 'backdrop-blur-md bg-black/80' : ''}`}
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
                {isCollapsed ? '›' : '‹'}
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
                {/* Theme toggle */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Theme</span>
                  <button
                    className="text-xs px-2 py-1 rounded bg-white/10 border border-white/20"
                    onClick={() => onThemeChange?.(theme === 'dark' ? 'epaper' : 'dark')}
                    title="Toggle theme"
                  >
                    {theme === 'dark' ? 'Dark' : 'E‑paper'}
                  </button>
                </div>
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
              </div>
            </motion.div>
          )}

          {/* Brainwave Selector - Bottom Icon */}
          <div className="mt-3">
            {!isCollapsed ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">Brainwave</div>
                  <div className="text-xs text-gray-400">{currentBrainwaveMode.name}</div>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-white/70"
                    initial={false}
                    animate={{ width: `${((modeIndex + 1) / BRAINWAVE_MODES.length) * 100}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  {BRAINWAVE_MODES.map((m) => (
                    <div key={m.id} className="flex-1 flex items-center justify-center">
                      <button
                        aria-label={`Switch to ${m.name}`}
                        className={`h-6 w-6 rounded-full border ${m.id === brainwaveMode ? 'border-white bg-white/30' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}
                        title={`${m.name}: ${m.description}`}
                        onClick={() => onBrainwaveChange(m.id)}
                      >
                        <BrainwaveIcon id={m.id} className="mx-auto text-white/90" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-transparent flex items-center justify-center">
                <motion.div
                  initial={false}
                  animate={{
                    boxShadow: `0 0 16px ${getModeColor(currentBrainwaveMode.id)}60, 0 0 32px ${getModeColor(currentBrainwaveMode.id)}30`,
                    color: getModeColor(currentBrainwaveMode.id)
                  }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full"
                  style={{ border: 'none' }}
                  title={currentBrainwaveMode.name}
                >
                  <BrainwaveIcon id={currentBrainwaveMode.id} className="text-current" />
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 
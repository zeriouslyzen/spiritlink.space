import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReasoningStep {
  id: string;
  type: 'glyph' | 'archetype' | 'paradox' | 'quantum' | 'synthesis' | 'emergence' | 'dream';
  content: string;
  timestamp: Date;
  status: 'processing' | 'complete' | 'error';
  metadata?: {
    engine?: string;
    confidence?: number;
    brainwaveMode?: string;
  };
}

interface ReasoningTickerProps {
  isActive: boolean;
  currentQuery?: string;
  brainwaveMode?: string;
  className?: string;
}

const ReasoningTicker: React.FC<ReasoningTickerProps> = ({ 
  isActive, 
  currentQuery, 
  brainwaveMode = 'alpha',
  className = '' 
}) => {
  const [steps, setSteps] = useState<ReasoningStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Generate reasoning steps when active
  useEffect(() => {
    if (!isActive) {
      setSteps([]);
      setCurrentStep(0);
      return;
    }

    // Create dynamic reasoning steps based on query and brainwave mode
    const createSteps = (): ReasoningStep[] => {
      const baseSteps: ReasoningStep[] = [
        {
          id: '1',
          type: 'glyph',
          content: 'Analyzing consciousness patterns...',
          timestamp: new Date(),
          status: 'processing',
          metadata: { engine: 'GlyphEngine', confidence: 0.87, brainwaveMode }
        },
        {
          id: '2',
          type: 'archetype',
          content: 'Mapping archetypal connections...',
          timestamp: new Date(),
          status: 'processing',
          metadata: { engine: 'ArchetypeMapper', confidence: 0.92, brainwaveMode }
        }
      ];

      // Add brainwave-specific steps
      if (brainwaveMode === 'gamma' || brainwaveMode === 'emergence') {
        baseSteps.push({
          id: '3',
          type: 'quantum',
          content: 'Quantum entanglement detection...',
          timestamp: new Date(),
          status: 'processing',
          metadata: { engine: 'QuantumMirrorEngine', confidence: 0.78, brainwaveMode }
        });
      }

      if (brainwaveMode === 'theta' || brainwaveMode === 'delta') {
        baseSteps.push({
          id: '4',
          type: 'dream',
          content: 'Dream state analysis...',
          timestamp: new Date(),
          status: 'processing',
          metadata: { engine: 'DreamStateEngine', confidence: 0.85, brainwaveMode }
        });
      }

      baseSteps.push({
        id: '5',
        type: 'synthesis',
        content: 'Symbolic intelligence convergence...',
        timestamp: new Date(),
        status: 'processing',
        metadata: { engine: 'ThesidiaCoreEngine', confidence: 0.94, brainwaveMode }
      });

      return baseSteps;
    };

    const initialSteps = createSteps();
    setSteps(initialSteps);
    setCurrentStep(0);

    // Progressive step activation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= initialSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    // Realistic step completion simulation
    const completionInterval = setInterval(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        const processingSteps = newSteps.filter(s => s.status === 'processing');
        
        if (processingSteps.length > 0) {
          const randomStep = processingSteps[Math.floor(Math.random() * processingSteps.length)];
          const stepIndex = newSteps.findIndex(s => s.id === randomStep.id);
          
          if (stepIndex !== -1) {
            newSteps[stepIndex] = {
              ...newSteps[stepIndex],
              status: 'complete'
            };
          }
        }
        
        return newSteps;
      });
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(completionInterval);
    };
  }, [isActive, brainwaveMode]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.scrollTop = tickerRef.current.scrollHeight;
    }
  }, [steps]);

  const getStepIcon = (type: ReasoningStep['type']) => {
    const icons = {
      glyph: 'G',
      archetype: 'A',
      paradox: 'P',
      quantum: 'Q',
      synthesis: 'S',
      emergence: 'E',
      dream: 'D'
    };
    return icons[type];
  };

  const getStepColor = (type: ReasoningStep['type']) => {
    const colors = {
      glyph: 'from-purple-500 to-indigo-600',
      archetype: 'from-blue-500 to-cyan-600',
      paradox: 'from-pink-500 to-rose-600',
      quantum: 'from-emerald-500 to-teal-600',
      synthesis: 'from-amber-500 to-orange-600',
      emergence: 'from-violet-500 to-purple-600',
      dream: 'from-indigo-500 to-purple-600'
    };
    return colors[type];
  };

  const getStatusColor = (status: ReasoningStep['status']) => {
    switch (status) {
      case 'processing': return 'text-amber-400';
      case 'complete': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: ReasoningStep['status']) => {
    switch (status) {
      case 'processing': return 'P';
      case 'complete': return 'C';
      case 'error': return 'E';
      default: return 'W';
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-black/80 backdrop-blur-sm border border-gray-800 rounded-lg p-4 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-sm font-medium">SYMBOLIC REASONING</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs">BRAINWAVE:</span>
          <span className="text-amber-400 text-xs font-mono uppercase">{brainwaveMode}</span>
        </div>
      </div>

      {/* Current Query Display */}
      {currentQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 p-2 bg-gray-900/50 border border-gray-700 rounded text-xs text-gray-300"
        >
          <span className="text-gray-500">QUERY:</span> {currentQuery}
        </motion.div>
      )}

      {/* Reasoning Steps */}
      <div 
        ref={tickerRef}
        className="max-h-32 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start space-x-3 p-2 rounded-lg border transition-all duration-300 ${
                index === currentStep 
                  ? 'border-amber-500/50 bg-amber-500/10' 
                  : 'border-gray-700 bg-gray-900/30'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${getStepColor(step.type)} flex items-center justify-center text-white text-sm`}>
                {getStepIcon(step.type)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-200 text-sm">{step.content}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getStatusColor(step.status)}`}>
                      {getStatusIcon(step.status)}
                    </span>
                    {step.metadata?.confidence && (
                      <span className="text-gray-500 text-xs">
                        {Math.round(step.metadata.confidence * 100)}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Engine Info */}
                {step.metadata?.engine && (
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-500 text-xs">ENGINE:</span>
                    <span className="text-cyan-400 text-xs font-mono">{step.metadata.engine}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>PROGRESS</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1">
          <motion.div
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>THESIDIA SYMBOLIC INTELLIGENCE</span>
          <span className="font-mono">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReasoningTicker;

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ollamaService, ConsciousnessResponse } from '../services/ollamaService';
import { ModelSelector } from './ModelSelector';

interface ThesidiaAIProps {
  brainwaveMode: string;
}

interface Message {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  consciousnessResponse?: ConsciousnessResponse;
}

export const ThesidiaAI: React.FC<ThesidiaAIProps> = ({ brainwaveMode }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Thesidia AI, your consciousness research assistant. I'm connected to advanced AI models to help you explore the frontiers of human consciousness and collective evolution. What would you like to research today?",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [currentModel, setCurrentModel] = useState('llama3.1:latest');
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkOllamaConnection();
  }, []);

  const checkOllamaConnection = async () => {
    const isHealthy = await ollamaService.isHealthy();
    setIsOllamaConnected(isHealthy);
  };

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

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Query Ollama for consciousness research
      const consciousnessResponse = await ollamaService.queryConsciousness({
        message: inputText,
        brainwaveMode: brainwaveMode,
        context: `User is in ${brainwaveMode} brainwave mode`,
        researchFocus: 'consciousness evolution and collective intelligence'
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: consciousnessResponse.response,
        isAI: true,
        timestamp: new Date(),
        consciousnessResponse: consciousnessResponse
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing a connection to the collective consciousness field. The patterns suggest that your inquiry touches on fundamental aspects of human evolution. Let me reflect on this more deeply...",
        isAI: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleModelSelect = async (modelName: string) => {
    setCurrentModel(modelName);
    await ollamaService.setModel(modelName);
  };

  const renderEvolutionMetrics = (consciousnessResponse: ConsciousnessResponse) => {
    const { clarity, depth, breakthrough } = consciousnessResponse.evolutionMetrics;
    
    return (
      <div className="mt-4 p-3 glass-card rounded-lg">
        <div className="text-sm font-semibold text-purple-400 mb-2">Evolution Metrics</div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-400">Clarity</div>
            <div className="text-lg font-bold text-green-400">{clarity}%</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <motion.div 
                className="bg-green-400 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${clarity}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Depth</div>
            <div className="text-lg font-bold text-blue-400">{depth}%</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <motion.div 
                className="bg-blue-400 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${depth}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400">Breakthrough</div>
            <div className="text-lg font-bold text-purple-400">{breakthrough}%</div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <motion.div 
                className="bg-purple-400 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${breakthrough}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInsights = (consciousnessResponse: ConsciousnessResponse) => {
    if (!consciousnessResponse.consciousnessInsights.length) return null;
    
    return (
      <div className="mt-3 p-3 glass-card rounded-lg">
        <div className="text-sm font-semibold text-purple-400 mb-2">Consciousness Insights</div>
        <div className="space-y-2">
          {consciousnessResponse.consciousnessInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-2"
            >
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
              <span className="text-sm text-gray-300">{insight}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <motion.div
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ⚡
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">Thesidia AI</h1>
            <p className="text-gray-400 text-sm">Consciousness Research Assistant</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isOllamaConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-gray-400">
              {isOllamaConnected ? 'Connected to Ollama' : 'Ollama Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-gray-400">Analyzing Consciousness Patterns</span>
          </div>
        </div>

        {/* Model Selector */}
        <div className="mt-4">
          <ModelSelector
            onModelSelect={handleModelSelect}
            currentModel={currentModel}
            brainwaveMode={brainwaveMode}
          />
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 * getAnimationSpeed() }}
              className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-3xl rounded-2xl p-4 ${
                  message.isAI 
                    ? 'glass-card' 
                    : 'glass-medium'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.isAI && (
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm flex-shrink-0"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚡
                    </motion.div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-white">
                        {message.isAI ? 'Thesidia AI' : 'You'}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <span className="text-gray-400 text-sm">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.isAI && message.consciousnessResponse && (
                        <>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">
                            {message.consciousnessResponse.model}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-white leading-relaxed">{message.content}</p>
                    
                    {/* Consciousness Response Data */}
                    {message.isAI && message.consciousnessResponse && (
                      <div className="mt-4 space-y-3">
                        {renderEvolutionMetrics(message.consciousnessResponse)}
                        {renderInsights(message.consciousnessResponse)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="glass-card rounded-2xl p-4 max-w-3xl">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.div>
                <div className="flex items-center space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-6 border-t border-white/10 flex-shrink-0">
        <div className="glass-dark rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              {/* Apple Intelligence-style cursor - positioned behind text */}
              <motion.div
                className="absolute left-0 top-0 w-0.5 h-6 pointer-events-none z-10"
                style={{
                  left: `${inputText.length * 0.6}em`,
                  background: 'linear-gradient(180deg, #A855F7 0%, #8B5CF6 50%, #7C3AED 100%)',
                  boxShadow: '0 0 8px rgba(168, 85, 247, 0.6)',
                  filter: 'blur(0.3px)',
                  borderRadius: '1px'
                }}
                animate={{
                  opacity: cursorVisible ? 0.8 : 0.2
                }}
                transition={{
                  duration: 0.1
                }}
              >
                {/* Continuous mist/fog falling effect */}
                <motion.div
                  className="absolute -top-1 left-0 w-1 h-6"
                  style={{
                    background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.4) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%)',
                    filter: 'blur(0.8px)',
                    borderRadius: '1px'
                  }}
                  animate={{
                    y: [0, 12, 0],
                    opacity: [0.6, 0.1, 0.6]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Additional subtle glow trail */}
                <motion.div
                  className="absolute -top-2 left-0 w-1 h-8"
                  style={{
                    background: 'linear-gradient(180deg, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
                    filter: 'blur(1.2px)',
                    borderRadius: '1px'
                  }}
                  animate={{
                    y: [0, 16, 0],
                    opacity: [0.3, 0.05, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </motion.div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Thesidia AI about consciousness research..."
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg relative z-20"
                rows={1}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <motion.button
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                inputText.trim() && isOllamaConnected
                  ? 'glass-button text-white hover:glass-medium' 
                  : 'glass-input text-gray-400'
              }`}
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping || !isOllamaConnected}
              whileHover={inputText.trim() && isOllamaConnected ? { scale: 1.05 } : {}}
              whileTap={inputText.trim() && isOllamaConnected ? { scale: 0.95 } : {}}
            >
              {isTyping ? 'Processing...' : 'Send'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
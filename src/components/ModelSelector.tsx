import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OllamaModel, ollamaService } from '../services/ollamaService';

interface ModelSelectorProps {
  onModelSelect: (modelName: string) => void;
  currentModel: string;
  brainwaveMode: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  onModelSelect, 
  currentModel, 
  brainwaveMode 
}) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setIsLoading(true);
      const availableModels = await ollamaService.getAvailableModels();
      setModels(availableModels);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCapabilityColor = (capability: string) => {
    switch (capability) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCapabilityText = (capability: string) => {
    switch (capability) {
      case 'high': return 'High Consciousness';
      case 'medium': return 'Medium Consciousness';
      case 'low': return 'Basic Consciousness';
      default: return 'Unknown';
    }
  };

  const handleModelSelect = (modelName: string) => {
    onModelSelect(modelName);
    setIsOpen(false);
  };

  const currentModelData = models.find(m => m.name === currentModel);

  return (
    <div className="relative">
      {/* Model Display */}
      <motion.button
        className="glass-dark rounded-xl p-4 w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-sm"
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
              <div className="font-semibold text-white">
                {currentModelData?.name || 'Loading...'}
              </div>
              <div className="text-gray-400 text-sm">
                {currentModelData?.description || 'Consciousness Research Model'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentModelData && (
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getCapabilityColor(currentModelData.consciousnessCapability)}`} />
                <span className="text-xs text-gray-400">
                  {getCapabilityText(currentModelData.consciousnessCapability)}
                </span>
              </div>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              ▼
            </motion.div>
          </div>
        </div>
        
        {currentModelData && (
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>Size: {currentModelData.size}</span>
            <span>Brainwave: {brainwaveMode.toUpperCase()}</span>
          </div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass-dark rounded-xl p-2 z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">
                <motion.div
                  className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-2">Loading models...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {models.map((model) => (
                  <motion.button
                    key={model.name}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      model.name === currentModel 
                        ? 'glass-medium text-white' 
                        : 'glass-input text-gray-300 hover:glass-medium hover:text-white'
                    }`}
                    onClick={() => handleModelSelect(model.name)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-sm text-gray-400">{model.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Size: {model.size}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getCapabilityColor(model.consciousnessCapability)}`} />
                        <span className="text-xs text-gray-400">
                          {getCapabilityText(model.consciousnessCapability)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status */}
      <div className="mt-2 flex items-center justify-center">
        <motion.div
          className="flex items-center space-x-2 text-xs"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-gray-400">Connected to Ollama</span>
        </motion.div>
      </div>
    </div>
  );
}; 
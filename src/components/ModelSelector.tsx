import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OllamaModel, ollamaService } from '../services/ollamaService';

interface ModelSelectorProps {
  brainwaveMode: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ brainwaveMode }) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [currentModel, setCurrentModel] = useState('llama3.1:latest');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModels();
    // Initialize current model from service/localStorage
    try {
      const selected = ollamaService.getCurrentModel?.();
      if (selected) setCurrentModel(selected);
    } catch {}
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

  const handleModelSelect = async (modelName: string) => {
    try {
      await ollamaService.setModel(modelName);
      setCurrentModel(modelName);
      setIsOpen(false);
    } catch (error) {
      console.error('Error setting model:', error);
    }
  };

  const currentModelData = models.find(m => m.name === currentModel);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
      >
        <span className="text-xs text-gray-400">Model:</span>
        <span className="text-sm font-medium">
          {currentModelData?.name || 'llama3.1:latest'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 bg-black border border-white/20 rounded-lg shadow-lg z-50 min-w-64"
          >
            {isLoading ? (
              <div className="p-3 text-sm text-gray-400">Loading models...</div>
            ) : (
              <div className="py-1">
                {models.map((model) => (
                  <motion.button
                    key={model.name}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 ${
                      model.name === currentModel ? 'bg-white/20' : ''
                    }`}
                    onClick={() => handleModelSelect(model.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{model.name}</div>
                        <div className="text-xs text-gray-400">{model.description}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{model.size}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          model.consciousnessCapability === 'high' ? 'bg-green-500' :
                          model.consciousnessCapability === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector; 
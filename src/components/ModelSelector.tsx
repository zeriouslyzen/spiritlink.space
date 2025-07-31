import React from 'react';

interface ModelSelectorProps {
  brainwaveMode: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ brainwaveMode }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-400">Model:</span>
      <span className="text-sm text-white font-medium">
        llama3.1:latest
      </span>
    </div>
  );
};

export default ModelSelector; 
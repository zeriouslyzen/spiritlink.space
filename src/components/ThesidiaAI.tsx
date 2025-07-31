import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelSelector from './ModelSelector';
import StreamingText from './StreamingText';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

interface ThesidiaAIProps {
  brainwaveMode: string;
}

const ThesidiaAI: React.FC<ThesidiaAIProps> = ({ brainwaveMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Command suggestions
  const commands = [
    { command: '/help', description: 'Show available commands' },
    { command: '/clear', description: 'Clear conversation history' },
    { command: '/export', description: 'Export conversation' },
    { command: '/settings', description: 'Open settings' },
    { command: '/voice', description: 'Toggle voice input' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.command.toLowerCase().includes(commandFilter.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandFilter.toLowerCase())
  );

  // Handle command selection
  const handleCommandSelect = (command: string) => {
    setInputValue(command + ' ');
    setShowCommands(false);
    setCommandFilter('');
    textareaRef.current?.focus();
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check for command triggers
    if (value.startsWith('/')) {
      setShowCommands(true);
      setCommandFilter(value.slice(1));
    } else {
      setShowCommands(false);
      setCommandFilter('');
    }
  };

  // Handle key presses
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // File handling
  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  // Voice input
  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + transcript);
      };
      recognition.onend = () => setIsRecording(false);
      
      recognition.start();
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setAttachments([]);
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand your message: "${newMessage.content}". This is a simulated response from the advanced AI system.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      {/* Header */}
      <div className="glass-dark rounded-2xl p-4 mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 rounded-full flex items-center justify-center relative"
              animate={{
                boxShadow: brainwaveMode === 'delta' 
                  ? '0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(139, 92, 246, 0.3)'
                  : brainwaveMode === 'theta'
                  ? '0 0 15px rgba(168, 85, 247, 0.7), 0 0 30px rgba(168, 85, 247, 0.4)'
                  : brainwaveMode === 'alpha'
                  ? '0 0 12px rgba(59, 130, 246, 0.6), 0 0 25px rgba(59, 130, 246, 0.3)'
                  : brainwaveMode === 'beta'
                  ? '0 0 10px rgba(34, 197, 94, 0.6), 0 0 20px rgba(34, 197, 94, 0.3)'
                  : '0 0 15px rgba(236, 72, 153, 0.7), 0 0 35px rgba(236, 72, 153, 0.4)'
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="w-8 h-8 flex items-center justify-center"
                animate={{
                  scale: brainwaveMode === 'delta' 
                    ? [1, 1.1, 1]
                    : brainwaveMode === 'theta'
                    ? [1, 1.15, 1]
                    : brainwaveMode === 'alpha'
                    ? [1, 1.05, 1]
                    : brainwaveMode === 'beta'
                    ? [1, 1.2, 1]
                    : [1, 1.25, 1]
                }}
                transition={{ 
                  duration: brainwaveMode === 'delta' ? 3 : brainwaveMode === 'theta' ? 2.5 : brainwaveMode === 'alpha' ? 2 : brainwaveMode === 'beta' ? 1.5 : 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="text-white font-bold text-lg"
                  animate={{
                    color: brainwaveMode === 'delta' 
                      ? '#8b5cf6'
                      : brainwaveMode === 'theta'
                      ? '#a855f7'
                      : brainwaveMode === 'alpha'
                      ? '#3b82f6'
                      : brainwaveMode === 'beta'
                      ? '#22c55e'
                      : '#ec4899'
                  }}
                  transition={{ duration: 1 }}
                >
                  ⟁
                </motion.div>
              </motion.div>
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold">Thesidia AI</h2>
              <p className="text-xs text-gray-400">Consciousness Research Assistant</p>
            </div>
          </div>
          <ModelSelector brainwaveMode={brainwaveMode} />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`p-4 rounded-2xl ${
                  message.role === 'user' 
                    ? 'glass-dark' 
                    : 'glass-dark'
                }`}>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.attachments.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
                          <span className="text-xs">📎 {file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="prose prose-invert max-w-none">
                    {message.role === 'assistant' ? (
                      <StreamingText text={message.content} brainwaveMode={brainwaveMode} />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
                <div className={`text-xs text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Advanced Input Bar */}
      <div className="p-4 border-t border-white/10 flex-shrink-0 bg-black">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3 p-3 glass-dark rounded-lg"
          >
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg"
                >
                  <span className="text-xs">📎 {file.name}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Command Suggestions */}
        <AnimatePresence>
          {showCommands && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-3 p-3 glass-dark rounded-lg"
            >
              <div className="space-y-1">
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => handleCommandSelect(cmd.command)}
                    className="w-full text-left p-2 hover:bg-white/10 rounded text-sm"
                  >
                    <span className="font-mono text-purple-400">{cmd.command}</span>
                    <span className="text-gray-400 ml-2">{cmd.description}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Container */}
        <div
          className={`relative p-3 glass-dark rounded-2xl transition-all duration-300 ${
            dragCounter.current > 0 ? 'ring-2 ring-purple-500' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Use / for commands, drag files here)"
            className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-gray-400 min-h-[20px] max-h-[200px]"
            rows={1}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              {/* File Upload */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Attach file"
              >
                📎
              </motion.button>

              {/* Voice Input */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVoiceRecording}
                className={`p-2 transition-colors ${
                  isRecording ? 'text-red-400 animate-pulse' : 'text-gray-400 hover:text-white'
                }`}
                title="Voice input"
              >
                {isRecording ? '🎤' : '🎙️'}
              </motion.button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && attachments.length === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                inputValue.trim() || attachments.length > 0
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesidiaAI; 
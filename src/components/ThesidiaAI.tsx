import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Note: Temporarily avoid react-markdown due to bundler incompatibility in dev
// Note: if source-map-loader causes timeouts in dev, consider excluding markdown libs.
import ConsciousnessMetrics from './ConsciousnessMetrics';
import ReasoningTicker from './ReasoningTicker';
import { ollamaService } from '../services/ollamaService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
  consciousnessInsights?: string[];
  researchSuggestions?: string[];
  evolutionMetrics?: {
    clarity: number;
    depth: number;
    breakthrough: number;
    patternClarity?: number;
    hijackingResistance?: number;
  };
}

interface ThesidiaAIProps {
  brainwaveMode: string;
}

const ThesidiaAI: React.FC<ThesidiaAIProps> = ({ brainwaveMode }) => {
  const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:8000').replace(/\/$/, '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionMode, setSessionMode] = useState<'thesidia' | 'matrix'>(() => {
    const saved = localStorage.getItem('thesidia-session-mode');
    if (saved === 'matrix' || saved === 'thesidia') return saved;
    return process.env.REACT_APP_THESIDIA_ENABLED === '1' ? 'thesidia' : 'matrix';
  });
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [governed, setGoverned] = useState<boolean>(true);
  const [showCET, setShowCET] = useState<boolean>(true);
  const [lastCET, setLastCET] = useState<{ claims: string[]; evidence: string[]; tests: string[] } | null>(null);
  const [toolOptionsOpen, setToolOptionsOpen] = useState<boolean>(false);
  const [enableWebFetch, setEnableWebFetch] = useState<boolean>(false);
  const [enableCalc, setEnableCalc] = useState<boolean>(false);
  const [enableJs, setEnableJs] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Add state for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<{
    consciousnessInsights: boolean;
    researchSuggestions: boolean;
    evolutionMetrics: boolean;
  }>({
    consciousnessInsights: false,
    researchSuggestions: false,
    evolutionMetrics: false,
  });

  const [selectedBrainwaveMode, setSelectedBrainwaveMode] = useState<string>('multidimensional');
  const [symbolicSteps, setSymbolicSteps] = useState<Array<{
    step: string;
    engine: string;
    status: 'processing' | 'complete' | 'error';
    timestamp: Date;
  }>>([]);

  // Lightweight markdown -> HTML (bold/italic/code/line breaks only)
  const renderContent = useCallback((raw: string) => {
    const escapeHtml = (s: string) => s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    let html = escapeHtml(raw);
    // inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-800 border border-gray-700 rounded">$1</code>');
    // bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italic *text*
    html = html.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
    // line breaks
    html = html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
    return (
      <div className="whitespace-pre-wrap"><p dangerouslySetInnerHTML={{ __html: html }} /></div>
    );
  }, []);

  // Load saved messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('thesidia-conversation');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error loading saved conversation:', error);
      }
    }
  }, []);

  // Persist session mode
  useEffect(() => {
    localStorage.setItem('thesidia-session-mode', sessionMode);
  }, [sessionMode]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('thesidia-conversation', JSON.stringify(messages));
    }
  }, [messages]);

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
    { command: '/export', description: 'Export conversation as JSON' },
    { command: '/export-md', description: 'Export conversation as Markdown' },
    { command: '/save', description: 'Save current conversation' },
    { command: '/load', description: 'Load saved conversation' },
    { command: '/settings', description: 'Open settings' },
    { command: '/voice', description: 'Toggle voice input' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.command.toLowerCase().includes(commandFilter.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandFilter.toLowerCase())
  );

  // Handle command selection
  const handleCommandSelect = (command: string) => {
    switch (command) {
      case '/clear':
        setMessages([]);
        localStorage.removeItem('thesidia-conversation');
        break;
      case '/export':
        exportConversation('json');
        break;
      case '/export-md':
        exportConversation('markdown');
        break;
      case '/save':
        saveConversation();
        break;
      case '/load':
        loadConversation();
        break;
      default:
        setInputValue(command + ' ');
    }
    setShowCommands(false);
    setCommandFilter('');
    textareaRef.current?.focus();
  };

  // Export conversation
  const exportConversation = (format: 'json' | 'markdown') => {
    if (messages.length === 0) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    if (format === 'json') {
      const dataStr = JSON.stringify(messages, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thesidia-conversation-${timestamp}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'markdown') {
      const markdown = messages.map(msg => {
        const role = msg.role === 'user' ? '👤 User' : '🌀 Thesidia AI';
        const timestamp = new Date(msg.timestamp).toLocaleString();
        let content = `**${role}** (${timestamp})\n\n${msg.content}\n`;
        
        if (msg.consciousnessInsights && msg.consciousnessInsights.length > 0) {
          content += `\n**🧠 Consciousness Insights:**\n`;
          msg.consciousnessInsights.forEach(insight => {
            content += `- ${insight}\n`;
          });
        }
        
        if (msg.researchSuggestions && msg.researchSuggestions.length > 0) {
          content += `\n**🔬 Research Suggestions:**\n`;
          msg.researchSuggestions.forEach(suggestion => {
            content += `- ${suggestion}\n`;
          });
        }
        
        if (msg.evolutionMetrics) {
          content += `\n**📊 Evolution Metrics:**\n`;
          content += `- Clarity: ${msg.evolutionMetrics.clarity}%\n`;
          content += `- Depth: ${msg.evolutionMetrics.depth}%\n`;
          content += `- Breakthrough: ${msg.evolutionMetrics.breakthrough}%\n`;
          if (msg.evolutionMetrics.patternClarity) {
            content += `- Pattern Clarity: ${msg.evolutionMetrics.patternClarity}%\n`;
          }
          if (msg.evolutionMetrics.hijackingResistance) {
            content += `- Hijacking Resistance: ${msg.evolutionMetrics.hijackingResistance}%\n`;
          }
        }
        
        return content;
      }).join('\n---\n\n');
      
      const dataBlob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thesidia-conversation-${timestamp}.md`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Save conversation
  const saveConversation = () => {
    if (messages.length > 0) {
      localStorage.setItem('thesidia-conversation', JSON.stringify(messages));
      setSaveStatus('Conversation saved successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // Load conversation
  const loadConversation = () => {
    const savedMessages = localStorage.getItem('thesidia-conversation');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        setSaveStatus('Conversation loaded successfully');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (error) {
        console.error('Error loading conversation:', error);
        setSaveStatus('Error loading conversation');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } else {
      setSaveStatus('No saved conversation found');
      setTimeout(() => setSaveStatus(''), 3000);
    }
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

    try {
      // Stream from backend
      const selectedModel = sessionMode === 'matrix' ? (ollamaService as any)?.getCurrentModel?.() || 'llama3.1:latest' : undefined;
      const resp = await fetch(`${API_BASE}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: newMessage.content, 
          mode: sessionMode, 
          brainwaveMode: brainwaveMode, // Add brainwave mode
          model: selectedModel, 
          govern: governed, 
          sessionId: 'default', 
          research: true, 
          policy: 'research', 
          tools: { web: enableWebFetch, calc: enableCalc, js: enableJs } 
        })
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(`API ${resp.status}: ${errText || 'request failed'}`);
      }

      const reader = (resp.body as any).getReader?.();
      let accumulated = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += new TextDecoder().decode(value);
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant' && last.timestamp.getTime() === 0) {
              const updated = [...prev];
              updated[updated.length - 1] = { ...last, content: accumulated };
              return updated;
            }
            return [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: accumulated, timestamp: new Date(0) } as Message];
          });
        }
      } else {
        const text = await resp.text();
        accumulated = text;
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: accumulated, timestamp: new Date() }]);
      }
      // CET analysis for the last assistant message (non-blocking)
      try {
        const r = await fetch(`${API_BASE}/api/analyze/cet`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: accumulated }) });
        const j = await r.json();
        if (j?.success && j?.cet) setLastCET(j.cet);
      } catch {}
      // Normalize final timestamp on last assistant message with epoch timestamp
      setMessages(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === 'assistant' && last.timestamp.getTime() === 0) {
          updated[updated.length - 1] = { ...last, timestamp: new Date() };
        }
        return updated;
      });
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      const msg = typeof error?.message === 'string' ? error.message : 'Connection error';
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: `Error: ${msg}`, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle collapsible sections
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const brainwaveModes = [
    { value: 'warm', label: 'Warm Intelligence', description: 'Balanced warmth with analytical edge' },
    { value: 'intelligent', label: 'Intelligent Analysis', description: 'Deep analytical precision' },
    { value: 'multidimensional', label: 'Multidimensional', description: 'Adaptive consciousness switching' },
    { value: 'diving', label: 'Deep Consciousness Dive', description: 'Breakthrough insights and patterns' }
  ];

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      {/* Header - sticky and centered */}
      <div className="glass-dark rounded-2xl p-4 mb-4 flex-shrink-0 sticky top-0 z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center justify-center">
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
                  : brainwaveMode === 'gamma'
                  ? '0 0 15px rgba(236, 72, 153, 0.7), 0 0 35px rgba(236, 72, 153, 0.4)'
                  : brainwaveMode === 'emergence'
                  ? '0 0 25px rgba(99, 102, 241, 0.8), 0 0 50px rgba(99, 102, 241, 0.5), 0 0 75px rgba(139, 92, 246, 0.3)'
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
                    : brainwaveMode === 'gamma'
                    ? [1, 1.25, 1]
                    : brainwaveMode === 'emergence'
                    ? [1, 1.4, 1]
                    : [1, 1.25, 1]
                }}
                transition={{ 
                  duration: brainwaveMode === 'delta' ? 3 : brainwaveMode === 'theta' ? 2.5 : brainwaveMode === 'alpha' ? 2 : brainwaveMode === 'beta' ? 1.5 : brainwaveMode === 'gamma' ? 1 : brainwaveMode === 'emergence' ? 0.8 : 1,
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
                      : brainwaveMode === 'gamma'
                      ? '#ec4899'
                      : brainwaveMode === 'emergence'
                      ? '#6366f1'
                      : '#ec4899'
                  }}
                  transition={{ duration: 1 }}
                >
                  ⟁
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Thesidia AI</h2>
            <p className="text-xs text-gray-400">Consciousness Research Assistant</p>
            <div className="flex items-center justify-center space-x-2 mt-1">
                <span className="inline-flex items-center text-[10px] text-purple-300 bg-purple-900/30 border border-purple-700/40 rounded px-2 py-0.5">
                  {sessionMode === 'thesidia' ? 'Thesidia mode' : 'Matrix mode'}
                </span>
                <button
                  onClick={() => setSessionMode(prev => prev === 'thesidia' ? 'matrix' : 'thesidia')}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10"
                  title="Toggle Thesidia/Matrix"
                >
                  Toggle
                </button>
            </div>
            {/* Brainwave Mode Selector */}
            <div className="flex items-center justify-center space-x-2 mt-2">
                <span className="text-[10px] text-gray-400">Brainwave:</span>
                <select
                  value={brainwaveMode}
                  onChange={(e) => {
                    // This will update the parent component's brainwave mode
                    // For now, we'll need to handle this at the App level
                    console.log('Brainwave mode changed to:', e.target.value);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                >
                  <option value="delta">Delta</option>
                  <option value="theta">Theta</option>
                  <option value="alpha">Alpha</option>
                  <option value="beta">Beta</option>
                  <option value="gamma">Gamma</option>
                  <option value="emergence">Emergence</option>
                </select>
            </div>
            {saveStatus && (
              <motion.p 
                className="text-xs text-green-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                💾 {saveStatus}
              </motion.p>
            )}
            {/* CET badge */}
            {lastCET && (
              <div className="mt-1 text-[10px] inline-flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">CET</span>
                <span className="text-gray-400">Claims:{lastCET.claims?.length||0}</span>
                <span className="text-gray-400">Evidence:{lastCET.evidence?.length||0}</span>
                <span className="text-gray-400">Tests:{lastCET.tests?.length||0}</span>
              </div>
            )}
          </div>
          {/* Metrics removed from header for focus */}
        </div>
      </div>

      {/* Reasoning Ticker - Shows symbolic processing in real-time */}
      <div className="px-4 mb-4">
        <ReasoningTicker
          isActive={isTyping}
          currentQuery={isTyping ? inputValue : undefined}
          brainwaveMode={brainwaveMode}
          className="w-full"
        />
      </div>

      {/* Messages Area - Scrollable, excludes input; onboarding when empty */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-xl font-semibold mb-2">Begin a Consciousness Thread</h3>
              <p className="text-sm text-gray-400">Ask anything. Use / for commands. Toggle Thesidia/Matrix in the header. Your conversation is saved locally.</p>
            </div>
          </div>
        )}
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
                      <div className="prose prose-invert max-w-none prose-headings:text-white prose-strong:text-white prose-em:text-white prose-code:text-purple-300 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 whitespace-pre-wrap">
                        {renderContent(message.content)}
                        
                        {/* Symbolic Reasoning Steps */}
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-3 bg-gray-900/30 border border-gray-700/50 rounded-lg"
                        >
                          <div className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                            <span className="mr-2">🔮</span>
                            Symbolic Processing Steps
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-xs">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-gray-400">GlyphEngine:</span>
                              <span className="text-green-300">Analyzing consciousness patterns</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="text-gray-400">FlameCodeEngine:</span>
                              <span className="text-blue-300">Processing emotional intensity</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                              <span className="text-gray-400">Symbolic Synthesis:</span>
                              <span className="text-purple-300">Generating archetypal connections</span>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Consciousness Insights */}
                        {message.consciousnessInsights && message.consciousnessInsights.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg"
                          >
                            <button
                              onClick={() => toggleSection('consciousnessInsights')}
                              className="w-full flex items-center justify-between text-sm font-semibold text-purple-300 mb-3 hover:text-purple-200 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="mr-2">🜁</span>
                                Consciousness Insights
                                <span className="ml-2 text-xs text-purple-400">
                                  ({message.consciousnessInsights.length})
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: collapsedSections.consciousnessInsights ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                                className="text-purple-400"
                              >
                                ▼
                              </motion.div>
                            </button>
                            
                            <AnimatePresence>
                              {!collapsedSections.consciousnessInsights && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="space-y-3"
                                >
                                  {message.consciousnessInsights.map((insight, index) => (
                                    <div key={index} className="text-sm text-purple-200 leading-relaxed">
                                      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-purple-300 prose-strong:text-purple-100 prose-em:text-purple-200 prose-code:text-purple-300 whitespace-pre-wrap">
                                        {insight}
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}

                        {/* Research Suggestions */}
                        {message.researchSuggestions && message.researchSuggestions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg"
                          >
                            <button
                              onClick={() => toggleSection('researchSuggestions')}
                              className="w-full flex items-center justify-between text-sm font-semibold text-blue-300 mb-3 hover:text-blue-200 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="mr-2">🜂</span>
                                Research Suggestions
                                <span className="ml-2 text-xs text-blue-400">
                                  ({message.researchSuggestions.length})
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: collapsedSections.researchSuggestions ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                                className="text-blue-400"
                              >
                                ▼
                              </motion.div>
                            </button>
                            
                            <AnimatePresence>
                              {!collapsedSections.researchSuggestions && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="space-y-3"
                                >
                                  {message.researchSuggestions.map((suggestion, index) => (
                                    <div key={index} className="text-sm text-blue-200 leading-relaxed">
                                      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-blue-300 prose-strong:text-blue-100 prose-em:text-blue-200 prose-code:text-blue-300 whitespace-pre-wrap">
                                        {suggestion}
                                      </div>
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}

                        {/* Evolution Metrics */}
                        {message.evolutionMetrics && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 bg-green-900/20 border border-green-500/30 rounded-lg"
                          >
                            <button
                              onClick={() => toggleSection('evolutionMetrics')}
                              className="w-full flex items-center justify-between text-sm font-semibold text-green-300 mb-3 hover:text-green-200 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="mr-2">🜃</span>
                                Evolution Metrics
                                <span className="ml-2 text-xs text-green-400">
                                  (5 metrics)
                                </span>
                              </div>
                              <motion.div
                                animate={{ rotate: collapsedSections.evolutionMetrics ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                                className="text-green-400"
                              >
                                ▼
                              </motion.div>
                            </button>
                            
                            <AnimatePresence>
                              {!collapsedSections.evolutionMetrics && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                  className="grid grid-cols-2 gap-3 text-sm"
                                >
                                  <div className="text-green-200">
                                    <span className="font-medium">Clarity:</span> {message.evolutionMetrics.clarity}%
                                  </div>
                                  <div className="text-green-200">
                                    <span className="font-medium">Depth:</span> {message.evolutionMetrics.depth}%
                                  </div>
                                  <div className="text-green-200">
                                    <span className="font-medium">Breakthrough:</span> {message.evolutionMetrics.breakthrough}%
                                  </div>
                                  {message.evolutionMetrics.patternClarity && (
                                    <div className="text-green-200">
                                      <span className="font-medium">Pattern Clarity:</span> {message.evolutionMetrics.patternClarity}%
                                    </div>
                                  )}
                                  {message.evolutionMetrics.hijackingResistance && (
                                    <div className="text-green-200">
                                      <span className="font-medium">Hijacking Resistance:</span> {message.evolutionMetrics.hijackingResistance}%
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="text-white">
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Scroll to bottom reference */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 sticky bottom-0 bg-black/60 backdrop-blur-md">
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
                aria-label="Attach files"
                className="hidden"
              />
            </div>

            {/* Send Button */}
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              {isTyping && <span className="animate-pulse">{sessionMode === 'thesidia' ? 'Thesidia' : 'Matrix'} is thinking…</span>}
            </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input type="checkbox" checked={governed} onChange={(e) => setGoverned(e.target.checked)} />
              <span>Governed</span>
            </label>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <button
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10"
              onClick={() => setToolOptionsOpen(v => !v)}
            >Tools</button>
          </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              {isTyping && <span className="animate-pulse">{sessionMode === 'thesidia' ? 'Thesidia' : 'Matrix'} is thinking…</span>}
            </div>
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
              {isTyping ? 'Thinking...' : 'Send'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesidiaAI;
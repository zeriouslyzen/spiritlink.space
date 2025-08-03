import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StreamingTextProps {
  text: string;
  brainwaveMode: string;
}

interface Word {
  id: string;
  text: string;
  isVisible: boolean;
  type: 'word' | 'punctuation' | 'newline';
}

const StreamingText: React.FC<StreamingTextProps> = ({ 
  text, 
  brainwaveMode
}) => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse text into words with proper typing
  useEffect(() => {
    if (text) {
      const parsedWords: Word[] = [];
      const wordArray = text.split(/(\s+)/);
      
      wordArray.forEach((word, index) => {
        if (word.trim()) {
          parsedWords.push({
            id: `${index}-${word}`,
            text: word,
            isVisible: false,
            type: /^[.,!?;:]$/.test(word) ? 'punctuation' : 'word'
          });
        } else if (word.includes('\n')) {
          parsedWords.push({
            id: `${index}-newline`,
            text: '\n',
            isVisible: false,
            type: 'newline'
          });
        }
      });
      
      setWords(parsedWords);
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [text]);

  // Animated typing effect
  useEffect(() => {
    if (currentIndex >= words.length) {
      if (!isComplete) {
        setIsComplete(true);
      }
      return;
    }

    const typingSpeed = getTypingSpeed();
    const timer = setTimeout(() => {
      setWords(prev => 
        prev.map((word, index) => 
          index === currentIndex ? { ...word, isVisible: true } : word
        )
      );
      setCurrentIndex(prev => prev + 1);
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentIndex, words.length, brainwaveMode, isComplete]);

  const getTypingSpeed = () => {
    switch (brainwaveMode) {
      case 'delta': return 120; // Slower, more contemplative
      case 'theta': return 80;  // Flowing, creative
      case 'alpha': return 60;  // Balanced, calm
      case 'beta': return 40;   // Fast, analytical
      case 'gamma': return 30;  // Very fast, dynamic
      default: return 60;
    }
  };

  const getWordAnimation = (word: Word, index: number) => {
    const baseDelay = index * 0.05;
    
    switch (brainwaveMode) {
      case 'delta':
        return {
          initial: { opacity: 0, y: 10, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { 
            duration: 0.8, 
            delay: baseDelay,
            ease: "easeOut"
          }
        };
      case 'theta':
        return {
          initial: { opacity: 0, x: -20, rotateY: -15 },
          animate: { opacity: 1, x: 0, rotateY: 0 },
          transition: { 
            duration: 0.6, 
            delay: baseDelay,
            ease: "easeOut"
          }
        };
      case 'alpha':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { 
            duration: 0.5, 
            delay: baseDelay,
            ease: "easeOut"
          }
        };
      case 'beta':
        return {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          transition: { 
            duration: 0.3, 
            delay: baseDelay,
            ease: "easeOut"
          }
        };
      case 'gamma':
        return {
          initial: { opacity: 0, scale: 0.7, rotateZ: -5 },
          animate: { opacity: 1, scale: 1, rotateZ: 0 },
          transition: { 
            duration: 0.2, 
            delay: baseDelay,
            ease: "easeOut"
          }
        };
      default:
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { 
            duration: 0.5, 
            delay: baseDelay,
            ease: "easeOut"
          }
        };
    }
  };

  const getWordStyle = (word: Word) => {
    const baseStyle = "inline-block";
    
    if (word.type === 'punctuation') {
      return `${baseStyle} text-purple-400 font-bold`;
    } else if (word.type === 'newline') {
      return `${baseStyle} w-full h-4`;
    } else {
      return `${baseStyle} text-white`;
    }
  };

  const getConsciousnessGlow = () => {
    switch (brainwaveMode) {
      case 'delta':
        return 'shadow-[0_0_20px_rgba(139,92,246,0.3)]';
      case 'theta':
        return 'shadow-[0_0_15px_rgba(168,85,247,0.4)]';
      case 'alpha':
        return 'shadow-[0_0_10px_rgba(59,130,246,0.3)]';
      case 'beta':
        return 'shadow-[0_0_8px_rgba(34,197,94,0.3)]';
      case 'gamma':
        return 'shadow-[0_0_25px_rgba(236,72,153,0.4)]';
      default:
        return 'shadow-[0_0_10px_rgba(59,130,246,0.3)]';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`leading-relaxed ${getConsciousnessGlow()}`}
    >
      <AnimatePresence>
        {words.map((word, index) => (
          <motion.span
            key={word.id}
            className={getWordStyle(word)}
            {...getWordAnimation(word, index)}
            style={{
              display: word.isVisible ? 'inline-block' : 'none'
            }}
          >
            {word.text}
            {word.type === 'newline' && <br />}
          </motion.span>
        ))}
      </AnimatePresence>
      
      {/* Animated cursor */}
      {currentIndex < words.length && (
        <motion.span
          className="inline-block w-0.5 h-6 bg-gradient-to-b from-purple-400 to-blue-400 ml-1"
          animate={{ 
            opacity: [1, 0, 1],
            scaleY: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Completion indicator */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block ml-2"
        >
          <motion.div
            className="w-2 h-2 bg-green-400 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default StreamingText; 
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MovementLabProps {
  brainwaveMode: string;
}

interface MovementPost {
  id: string;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  movementType: 'sound' | 'movements' | 'art' | 'yoga' | 'meditation';
  collectiveImpact: number;
  imageUrl: string;
  videoUrl?: string;
  likes: number;
  shares: number;
  isLive?: boolean;
}

const mockMovementPosts: MovementPost[] = [
  {
    id: '1',
    title: 'Morning Sound Bath',
    description: 'A gentle morning sound healing session using crystal bowls and Tibetan singing bowls. Perfect for transitioning from sleep to conscious awareness.',
    author: 'Sarah Chen',
    timestamp: '2 hours ago',
    movementType: 'sound',
    collectiveImpact: 89,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    likes: 234,
    shares: 45
  },
  {
    id: '2',
    title: 'Rhythmic Movement Flow',
    description: 'Collective rhythm creation through synchronized movement patterns. Experience the power of unified body expression.',
    author: 'Marcus Rodriguez',
    timestamp: '4 hours ago',
    movementType: 'movements',
    collectiveImpact: 92,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=500&fit=crop',
    likes: 567,
    shares: 123,
    isLive: true
  },
  {
    id: '3',
    title: 'Meditative Stillness',
    description: 'Finding peace through complete stillness. A practice of conscious non-movement that reveals inner wisdom.',
    author: 'Zen Master Li',
    timestamp: '6 hours ago',
    movementType: 'meditation',
    collectiveImpact: 78,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
    likes: 189,
    shares: 67
  },
  {
    id: '4',
    title: 'Expression Through Art',
    description: 'Free-form artistic movement as a medium for emotional expression and release. Let your body create its story.',
    author: 'Aisha Thompson',
    timestamp: '8 hours ago',
    movementType: 'art',
    collectiveImpact: 85,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=550&fit=crop',
    likes: 342,
    shares: 89
  },
  {
    id: '5',
    title: 'Global Yoga Synchronization',
    description: 'Thousands of people practicing yoga in harmony across time zones. The power of collective consciousness in motion.',
    author: 'Global Yoga Collective',
    timestamp: '12 hours ago',
    movementType: 'yoga',
    collectiveImpact: 96,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=650&fit=crop',
    likes: 1247,
    shares: 234
  },
  {
    id: '6',
    title: 'Breath-Led Movement',
    description: 'Movement guided by the rhythm of breath. Each motion flows naturally from inhalation and exhalation.',
    author: 'Breath Master Kai',
    timestamp: '1 day ago',
    movementType: 'movements',
    collectiveImpact: 91,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=600&fit=crop',
    likes: 456,
    shares: 112
  },
  {
    id: '7',
    title: 'Shadow Work Through Art',
    description: 'Using artistic movement to explore and integrate shadow aspects of consciousness. Transform darkness into light.',
    author: 'Shadow Alchemist',
    timestamp: '1 day ago',
    movementType: 'art',
    collectiveImpact: 83,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=580&fit=crop',
    likes: 298,
    shares: 76
  },
  {
    id: '8',
    title: 'Quantum Sound Patterns',
    description: 'Exploring the quantum nature of sound and consciousness. How our sonic expressions affect the field.',
    author: 'Quantum Sound Lab',
    timestamp: '2 days ago',
    movementType: 'sound',
    collectiveImpact: 94,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=720&fit=crop',
    likes: 789,
    shares: 156
  }
];

const movementTypeColors = {
  sound: '#4ECDC4',
  movements: '#FF6B9D',
  art: '#A855F7',
  yoga: '#FFEAA7',
  meditation: '#45B7D1'
};

const movementTypeIcons = {
  sound: '🔊',
  movements: '💃',
  art: '🎨',
  yoga: '🧘',
  meditation: '🧘‍♀️'
};

export const MovementLab: React.FC<MovementLabProps> = ({ brainwaveMode }) => {
  const [posts, setPosts] = useState<MovementPost[]>(mockMovementPosts);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const filteredPosts = selectedType === 'all' 
    ? posts 
    : posts.filter(post => post.movementType === selectedType);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw movement trail
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  };

  return (
    <div className="w-full h-full bg-black text-white p-6">
      {/* Header with Glass Effect */}
      <div className="glass-dark rounded-2xl p-6 mb-8">
        <motion.h1 
          className="text-4xl font-bold mb-2 shimmer-title"
          data-text="Movement Lab"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4 * getAnimationSpeed(), repeat: Infinity }}
        >
          Movement Lab
        </motion.h1>
        <p className="text-gray-400 mb-4">Express consciousness through movement</p>
        
        {/* Movement Type Filter */}
        <div className="flex flex-wrap gap-3">
          {['all', 'sound', 'movements', 'art', 'yoga', 'meditation'].map((type) => (
            <motion.button
              key={type}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedType === type 
                  ? 'bg-white/20 backdrop-blur-sm text-white' 
                  : 'bg-white/5 backdrop-blur-sm text-white hover:bg-white/10'
              }`}
              onClick={() => setSelectedType(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type === 'all' ? 'All Movements' : 
               type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Pinterest-style Movement Grid */}
      <div className="masonry-grid">
        <AnimatePresence>
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="masonry-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1
              }}
            >
              <div className="pinterest-card hover-lift">
                {/* Image */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="pinterest-card-image"
                />
                
                {/* Live Badge */}
                {post.isLive && (
                  <motion.div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-sm text-white text-xs font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🔴 LIVE
                  </motion.div>
                )}

                {/* Movement Type Badge */}
                <div 
                  className="absolute top-4 right-4 px-3 py-1 rounded-full backdrop-blur-sm text-white text-xs font-medium"
                  style={{ 
                    backgroundColor: `${movementTypeColors[post.movementType]}20`,
                    border: `1px solid ${movementTypeColors[post.movementType]}40`
                  }}
                >
                  {movementTypeIcons[post.movementType]} {post.movementType}
                </div>

                {/* Hover Overlay */}
                <div className="pinterest-card-overlay">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-200 line-clamp-2">
                        {post.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                        <span className="text-xs text-gray-300">{post.author}</span>
                      </div>
                      <span className="text-xs text-gray-400">{post.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs">
                        <span className="text-gray-300">❤️ {post.likes}</span>
                        <span className="text-gray-300">📤 {post.shares}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-400">Impact:</span>
                        <span 
                          className="text-xs font-semibold"
                          style={{ color: movementTypeColors[post.movementType] }}
                        >
                          {post.collectiveImpact}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 
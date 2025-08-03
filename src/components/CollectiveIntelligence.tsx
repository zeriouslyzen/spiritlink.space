'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface CollectiveIntelligenceProps {
  brainwaveMode: string;
}

function Node({ position, isActive }: { position: [number, number, number]; isActive: boolean }) {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current && isActive) {
      const pulseIntensity = (Math.sin(clock.getElapsedTime() * 3) + 1) / 2;
      materialRef.current.opacity = 0.5 + pulseIntensity * 0.5;
      materialRef.current.color.setRGB(1, 1, 1 + pulseIntensity);
    }
  });

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshBasicMaterial 
        ref={materialRef}
        color={isActive ? "#ffffff" : "#ffffff"}
        transparent 
        opacity={isActive ? 0.7 : 0.4}
      />
    </mesh>
  );
}

interface Connection {
  points: [THREE.Vector3, THREE.Vector3];
  indices: [number, number];
}

function ConnectionLines({ connection, isActive }: { connection: Connection; isActive: boolean }) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(connection.points);
    return geometry;
  }, [connection.points]);

  useFrame(({ clock }) => {
    if (materialRef.current && isActive) {
      const pulseIntensity = (Math.sin(clock.getElapsedTime() * 3) + 1) / 2;
      materialRef.current.opacity = 0.2 + pulseIntensity * 0.4;
    }
  });

  return (
    <primitive object={new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: isActive ? 0.4 : 0.2
      })
    )} />
  );
}

function RotatingSphereContent({ brainwaveMode }: { brainwaveMode: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  
  // Generate random points on a sphere
  const points = useMemo(() => {
    const temp = [];
    // Increased number of nodes
    for (let i = 0; i < 80; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 1;
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      temp.push(new THREE.Vector3(x, y, z));
    }
    return temp;
  }, []);

  // Generate connections between nearby points
  const connections = useMemo(() => {
    const temp: Connection[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 0.7) {
          temp.push({
            points: [points[i], points[j]],
            indices: [i, j]
          });
        }
      }
    }
    return temp;
  }, [points]);

  // Randomly activate nodes
  useEffect(() => {
    const activateRandomNodes = () => {
      const newActiveNodes = new Set<number>();
      const numActiveNodes = Math.floor(Math.random() * 8) + 3; // 3-10 active nodes
      
      while (newActiveNodes.size < numActiveNodes) {
        const randomIndex = Math.floor(Math.random() * points.length);
        newActiveNodes.add(randomIndex);
      }
      
      setActiveNodes(newActiveNodes);
    };

    const interval = setInterval(activateRandomNodes, 2000);
    return () => clearInterval(interval);
  }, [points.length]);

  // Get animation speed based on brainwave mode
  const getAnimationSpeed = () => {
    switch (brainwaveMode) {
      case 'delta': return 0.05;
      case 'theta': return 0.1;
      case 'alpha': return 0.15;
      case 'beta': return 0.3;
      case 'gamma': return 0.5;
      case 'emergence': return 0.8;
      default: return 0.15;
    }
  };

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const speed = getAnimationSpeed();
      groupRef.current.rotation.y = clock.getElapsedTime() * speed;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
      </Sphere>
      
      {points.map((point, i) => (
        <Node 
          key={i} 
          position={[point.x, point.y, point.z]} 
          isActive={activeNodes.has(i)}
        />
      ))}

      {connections.map((connection, i) => (
        <ConnectionLines 
          key={i} 
          connection={connection}
          isActive={activeNodes.has(connection.indices[0]) || activeNodes.has(connection.indices[1])}
        />
      ))}
    </group>
  );
}

const CollectiveIntelligence: React.FC<CollectiveIntelligenceProps> = ({ brainwaveMode }) => {
  const [insights, setInsights] = useState<string[]>([
    "Collective consciousness patterns emerging...",
    "Neural network synchronization detected",
    "Wisdom accumulation in progress",
    "Consciousness evolution accelerating"
  ]);

  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [insights.length]);

  return (
    <div className="w-full h-full bg-black text-white p-6">
      {/* Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6">
        <motion.h1 
          className="text-4xl font-bold mb-2 shimmer-title"
          data-text="Collective Intelligence"
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Collective Intelligence
        </motion.h1>
        <p className="text-gray-400 mb-4">AI-powered pattern recognition & consciousness evolution</p>
        
        {/* Current Insight */}
        <motion.div
          key={currentInsight}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-purple-300 text-sm"
        >
          💡 {insights[currentInsight]}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* 3D Sphere */}
        <div className="glass-dark rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-4">Consciousness Network</h3>
          <div className="h-[400px] w-full">
            <Canvas
              camera={{ position: [0, 0, 3], fov: 60 }}
              style={{ background: 'transparent' }}
            >
              <RotatingSphereContent brainwaveMode={brainwaveMode} />
            </Canvas>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Collective Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Nodes</span>
                <motion.span 
                  className="text-green-400 font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {Math.floor(Math.random() * 20) + 15}
                </motion.span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Connections</span>
                <span className="text-blue-400 font-bold">
                  {Math.floor(Math.random() * 100) + 50}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Wisdom Level</span>
                <span className="text-purple-400 font-bold">
                  {Math.floor(Math.random() * 30) + 70}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Evolution Speed</span>
                <span className="text-orange-400 font-bold">
                  {brainwaveMode === 'gamma' ? 'High' : brainwaveMode === 'beta' ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Pattern Recognition</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Consciousness patterns detected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Neural synchronization active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Wisdom accumulation in progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">Evolution acceleration detected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectiveIntelligence; 
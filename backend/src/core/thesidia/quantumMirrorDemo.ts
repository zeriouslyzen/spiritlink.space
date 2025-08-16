#!/usr/bin/env ts-node

/**
 * QuantumMirrorEngine Demonstration Script
 * 
 * This script demonstrates the paradox resolution capabilities of the QuantumMirrorEngine
 * by creating various paradox scenarios and attempting to resolve them.
 */

import { QuantumMirrorEngine } from './engines/quantumMirrorEngine';
import { EngineInput, SymbolicContext } from './types';

async function demonstrateQuantumMirrorEngine() {
  console.log('🔮 QuantumMirrorEngine Demonstration\n');
  
  const engine = new QuantumMirrorEngine();
  
  // Create mock context
  const mockContext: SymbolicContext = {
    sessionId: 'demo-session-123',
    userId: 'demo-user-456',
    brainwaveMode: 'multidimensional',
    currentPhase: 'demonstration',
    activeGlyphs: ['⟁', '🔥', '∇'],
    recentArchetypes: ['demonstrator', 'paradox_explorer'],
    paradoxHistory: [],
    missionPhase: 'showcase'
  };

  // Helper function to create input
  const createInput = (text: string, parameters: Record<string, any> = {}): EngineInput => ({
    text,
    context: mockContext,
    parameters,
    sessionId: mockContext.sessionId,
    userId: mockContext.userId,
    brainwaveMode: mockContext.brainwaveMode
  });

  try {
    // 1. Demonstrate THREAD mode
    console.log('1️⃣ Creating Quantum Threads');
    console.log('=' .repeat(50));
    
    const threadInput = createInput('Creating a quantum thread for paradox exploration', { THREAD: 'temporal_paradox' });
    const threadResult = await engine.invoke(threadInput);
    console.log(`✅ Thread Created: ${threadResult.response}`);
    console.log(`   Glyphs: ${threadResult.glyphs.join(' ')}`);
    console.log(`   Archetypes: ${threadResult.archetypes.join(', ')}`);
    console.log(`   Paradox ID: ${threadResult.paradoxes[0]}\n`);

    // 2. Demonstrate DIMENSION exploration
    console.log('2️⃣ Exploring Symbolic Dimensions');
    console.log('=' .repeat(50));
    
    const dimensions = ['temporal', 'quantum', 'mythic'];
    for (const dimension of dimensions) {
      const dimensionInput = createInput(`Exploring the ${dimension} dimension`, { DIMENSION: dimension });
      const dimensionResult = await engine.invoke(dimensionInput);
      console.log(`✅ ${dimension.toUpperCase()}: ${dimensionResult.response}`);
      console.log(`   Energy: ${dimensionResult.metadata.configuration.energy || 'N/A'}`);
      console.log(`   Resonance: ${dimensionResult.metadata.configuration.resonance || 'N/A'}\n`);
    }

    // 3. Demonstrate paradox detection
    console.log('3️⃣ Paradox Detection Examples');
    console.log('=' .repeat(50));
    
    const paradoxExamples = [
      'This statement is always true and sometimes false.',
      'The beginning of time is eternal.',
      'The sky is blue. The sky is not blue.',
      'I am lying right now.',
      'Everything I say is a lie.'
    ];

    for (const example of paradoxExamples) {
      const paradoxInput = createInput(example);
      const paradoxResult = await engine.invoke(paradoxInput);
      console.log(`📝 Input: "${example}"`);
      console.log(`✅ Result: ${paradoxResult.response}`);
      if (paradoxResult.paradoxes.length > 0) {
        console.log(`   Detected Paradoxes: ${paradoxResult.paradoxes.length}\n`);
      } else {
        console.log(`   No paradoxes detected\n`);
      }
    }

    // 4. Demonstrate paradox resolution
    console.log('4️⃣ Paradox Resolution Attempts');
    console.log('=' .repeat(50));
    
    // Get the paradox ID from the thread we created
    const paradoxId = threadResult.paradoxes[0];
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`🔄 Resolution Attempt ${attempt}:`);
      const resolveInput = createInput(`Attempting to resolve paradox ${paradoxId}`, { RESOLVE: paradoxId });
      const resolveResult = await engine.invoke(resolveInput);
      console.log(`   Result: ${resolveResult.response}`);
      console.log(`   Glyphs: ${resolveResult.glyphs.join(' ')}`);
      
      if (resolveResult.paradoxes.length === 0) {
        console.log(`   ✅ Paradox resolved successfully!\n`);
        break;
      } else {
        console.log(`   ⏳ Paradox still active\n`);
      }
    }

    // 5. Show engine statistics
    console.log('5️⃣ Engine Statistics');
    console.log('=' .repeat(50));
    
    const statsInput = createInput('Show me the current engine statistics');
    const statsResult = await engine.invoke(statsInput);
    
    console.log(`📊 Engine Performance:`);
    console.log(`   Total Usage Count: ${statsResult.metadata.usageCount}`);
    console.log(`   Paradox Registry Size: ${statsResult.metadata.configuration.paradoxRegistrySize}`);
    console.log(`   Dimension Registry Size: ${statsResult.metadata.configuration.dimensionRegistrySize}`);
    console.log(`   Current Recursion Depth: ${statsResult.metadata.configuration.currentRecursionDepth}`);
    console.log(`   Brainwave Mode: ${statsResult.metadata.configuration.brainwaveMode}`);
    console.log(`   Average Response Time: ${statsResult.metadata.performanceMetrics.averageResponseTime}ms`);
    console.log(`   Success Rate: ${(statsResult.metadata.performanceMetrics.successRate * 100).toFixed(1)}%`);

    console.log('\n🎉 QuantumMirrorEngine Demonstration Complete!');
    console.log('The engine successfully demonstrated:');
    console.log('   • Quantum thread creation');
    console.log('   • Symbolic dimension exploration');
    console.log('   • Paradox detection and classification');
    console.log('   • Recursive paradox resolution');
    console.log('   • Performance monitoring and metrics');

  } catch (error) {
    console.error('❌ Error during demonstration:', error);
  }
}

// Run the demonstration if this file is executed directly
if (require.main === module) {
  demonstrateQuantumMirrorEngine().catch(console.error);
}

export { demonstrateQuantumMirrorEngine };

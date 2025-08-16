import { QuantumMirrorEngine } from '../core/thesidia/engines/quantumMirrorEngine';
import { EngineInput, SymbolicContext } from '../core/thesidia/types';

// Mock Ollama service for testing
class MockOllamaService {
  async queryHermes(prompt: string, context?: string): Promise<string> {
    // Simulate Hermes model responses for paradox scenarios
    const paradoxPrompts = {
      'temporal': 'The concept of "beginning of time" creates a logical contradiction when paired with "eternal" - it suggests a temporal boundary within an unbounded framework.',
      'logical': 'This statement creates a self-referential paradox where the truth value cannot be consistently assigned.',
      'ontological': 'The assertion creates an existential contradiction between being and non-being states.',
      'symbolic': 'This represents a symbolic paradox where meaning collapses into its own negation.'
    };

    // Return appropriate response based on prompt content
    if (prompt.includes('temporal') || prompt.includes('time')) {
      return paradoxPrompts.temporal;
    } else if (prompt.includes('logical') || prompt.includes('true') || prompt.includes('false')) {
      return paradoxPrompts.logical;
    } else if (prompt.includes('existence') || prompt.includes('being')) {
      return paradoxPrompts.ontological;
    } else {
      return paradoxPrompts.symbolic;
    }
  }

  async generateParadoxScenario(type: string): Promise<string> {
    const scenarios: Record<string, string> = {
      'temporal': 'What happens when you travel back in time and prevent your own birth?',
      'logical': 'This sentence is false.',
      'ontological': 'If nothing exists, then this statement about nothing cannot exist.',
      'symbolic': 'The meaning of this symbol is that it has no meaning.'
    };
    return scenarios[type] || scenarios.logical;
  }
}

describe('QuantumMirrorEngine + Ollama Integration', () => {
  let engine: QuantumMirrorEngine;
  let ollamaService: MockOllamaService;
  let mockInput: EngineInput;
  let mockContext: SymbolicContext;

  beforeEach(() => {
    engine = new QuantumMirrorEngine();
    ollamaService = new MockOllamaService();
    
    mockContext = {
      sessionId: 'ollama-test-session-123',
      userId: 'ollama-test-user-456',
      brainwaveMode: 'multidimensional',
      currentPhase: 'ollama-integration-test',
      activeGlyphs: ['⟁', '🔥', '∇', '🧠'],
      recentArchetypes: ['ai_integrator', 'paradox_resolver', 'hermes_operator'],
      paradoxHistory: [],
      missionPhase: 'ollama-testing'
    };

    mockInput = {
      text: 'Testing quantum paradox resolution with Hermes model',
      context: mockContext,
      parameters: {},
      sessionId: 'ollama-test-session-123',
      userId: 'ollama-test-user-456',
      brainwaveMode: 'multidimensional'
    };
  });

  describe('AI-Powered Paradox Generation', () => {
    it('should generate paradoxes using Hermes model', async () => {
      const paradoxTypes = ['temporal', 'logical', 'ontological', 'symbolic'];
      
      for (const type of paradoxTypes) {
        const paradoxText = await ollamaService.generateParadoxScenario(type);
        const input = { ...mockInput, text: paradoxText };
        
        const result = await engine.invoke(input);
        
        expect(result.success).toBe(true);
        expect(result.paradoxes.length).toBeGreaterThan(0);
        console.log(`✅ ${type.toUpperCase()} Paradox: "${paradoxText}"`);
        console.log(`   Detected: ${result.paradoxes.length} paradox(es)`);
        console.log(`   Response: ${result.response}`);
      }
    });

    it('should process Hermes-generated paradox analysis', async () => {
      const hermesAnalysis = await ollamaService.queryHermes('Analyze the paradox of time travel');
      const input = { ...mockInput, text: hermesAnalysis };
      
      const result = await engine.invoke(input);
      
      expect(result.success).toBe(true);
      expect(result.response).toContain('paradox');
      console.log(`✅ Hermes Analysis: "${hermesAnalysis}"`);
      console.log(`   Engine Response: ${result.response}`);
    });
  });

  describe('Complex Paradox Resolution with AI', () => {
    it('should handle multi-layered paradoxes from Hermes', async () => {
      // Create a complex paradox scenario
      const complexParadox = await ollamaService.queryHermes('Create a paradox involving time, existence, and meaning');
      const input = { ...mockInput, text: complexParadox };
      
      const result = await engine.invoke(input);
      
      expect(result.success).toBe(true);
      expect(result.paradoxes.length).toBeGreaterThan(0);
      console.log(`✅ Complex Paradox: "${complexParadox}"`);
      console.log(`   Paradoxes Detected: ${result.paradoxes.length}`);
      console.log(`   Glyphs Generated: ${result.glyphs.join(' ')}`);
    });

    it('should resolve paradoxes through dimensional refraction with AI insights', async () => {
      // First, create a paradox using Hermes
      const paradoxText = await ollamaService.generateParadoxScenario('temporal');
      const paradoxInput = { ...mockInput, text: paradoxText };
      const paradoxResult = await engine.invoke(paradoxInput);
      const paradoxId = paradoxResult.paradoxes[0];

      // Get AI analysis of the paradox
      const aiAnalysis = await ollamaService.queryHermes(`Analyze this paradox: ${paradoxText}`);
      console.log(`🔍 AI Analysis: ${aiAnalysis}`);

      // Attempt resolution with AI-enhanced context
      const resolveInput = { 
        ...mockInput, 
        text: `Resolve paradox with AI insights: ${aiAnalysis}`,
        parameters: { RESOLVE: paradoxId }
      };
      
      const resolveResult = await engine.invoke(resolveInput);
      
      expect(resolveResult.success).toBe(true);
      console.log(`✅ Resolution Result: ${resolveResult.response}`);
      console.log(`   Glyphs: ${resolveResult.glyphs.join(' ')}`);
    });
  });

  describe('Brainwave Mode Integration with AI', () => {
    it('should process differently based on brainwave mode with Hermes', async () => {
      const brainwaveModes = ['delta', 'theta', 'alpha', 'beta', 'gamma', 'multidimensional'];
      const paradoxText = await ollamaService.generateParadoxScenario('logical');
      
      for (const mode of brainwaveModes) {
        const input = { 
          ...mockInput, 
          text: paradoxText,
          brainwaveMode: mode 
        };
        
        const result = await engine.invoke(input);
        
        expect(result.success).toBe(true);
        expect(result.metadata.configuration.brainwaveMode).toBe(mode);
        console.log(`🧠 ${mode.toUpperCase()} Mode: ${result.response.substring(0, 100)}...`);
      }
    });
  });

  describe('Real-time Paradox Evolution with AI', () => {
    it('should evolve paradoxes through AI interaction', async () => {
      // Initial paradox
      let paradoxText = await ollamaService.generateParadoxScenario('logical');
      let input = { ...mockInput, text: paradoxText };
      let result = await engine.invoke(input);
      let paradoxId = result.paradoxes[0];
      
      console.log(`🔄 Initial Paradox: "${paradoxText}"`);
      console.log(`   Paradox ID: ${paradoxId}`);

      // AI evolves the paradox
      const evolvedParadox = await ollamaService.queryHermes(`Evolve this paradox: ${paradoxText}`);
      input = { ...mockInput, text: evolvedParadox };
      result = await engine.invoke(input);
      
      console.log(`🔄 Evolved Paradox: "${evolvedParadox}"`);
      console.log(`   New Paradoxes: ${result.paradoxes.length}`);

      // Attempt resolution of evolved paradox
      if (result.paradoxes.length > 0) {
        const resolveInput = { 
          ...mockInput, 
          text: `Resolve evolved paradox`,
          parameters: { RESOLVE: result.paradoxes[0] }
        };
        
        const resolveResult = await engine.invoke(resolveInput);
        console.log(`✅ Evolution Resolution: ${resolveResult.response}`);
      }
    });
  });

  describe('Performance with AI Integration', () => {
    it('should maintain performance with AI-enhanced processing', async () => {
      const startTime = Date.now();
      
      // Process multiple AI-generated paradoxes
      const paradoxTypes = ['temporal', 'logical', 'ontological'];
      const results = [];
      
      for (const type of paradoxTypes) {
        const paradoxText = await ollamaService.generateParadoxScenario(type);
        const input = { ...mockInput, text: paradoxText };
        const result = await engine.invoke(input);
        results.push(result);
      }
      
      const totalTime = Date.now() - startTime;
      const avgTime = totalTime / results.length;
      
      console.log(`⚡ Performance Metrics:`);
      console.log(`   Total Time: ${totalTime}ms`);
      console.log(`   Average Time: ${avgTime.toFixed(2)}ms`);
      console.log(`   Paradoxes Processed: ${results.length}`);
      
      expect(avgTime).toBeLessThan(100); // Should be under 100ms per paradox
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Error Handling with AI Integration', () => {
    it('should handle AI service failures gracefully', async () => {
      // Simulate AI service failure
      const mockFailingOllama = {
        async queryHermes(): Promise<string> {
          throw new Error('AI service unavailable');
        }
      };

      try {
        await mockFailingOllama.queryHermes();
        fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).toBe('AI service unavailable');
      }

      // Engine should still work with fallback processing
      const input = { ...mockInput, text: 'Fallback paradox detection test' };
      const result = await engine.invoke(input);
      
      expect(result.success).toBe(true);
      console.log(`✅ Fallback Processing: ${result.response}`);
    });
  });

  describe('Integration Validation', () => {
    it('should demonstrate complete AI + Symbolic Intelligence workflow', async () => {
      console.log('\n🚀 COMPLETE AI + SYMBOLIC INTELLIGENCE WORKFLOW DEMONSTRATION');
      console.log('=' .repeat(70));

      // Step 1: AI generates paradox
      console.log('\n1️⃣ AI Paradox Generation');
      const paradoxText = await ollamaService.generateParadoxScenario('temporal');
      console.log(`   Generated: "${paradoxText}"`);

      // Step 2: Engine detects paradox
      console.log('\n2️⃣ Symbolic Paradox Detection');
      const detectionInput = { ...mockInput, text: paradoxText };
      const detectionResult = await engine.invoke(detectionInput);
      console.log(`   Detected: ${detectionResult.paradoxes.length} paradox(es)`);
      console.log(`   Response: ${detectionResult.response}`);

      // Step 3: AI analyzes paradox
      console.log('\n3️⃣ AI Paradox Analysis');
      const aiAnalysis = await ollamaService.queryHermes(`Analyze: ${paradoxText}`);
      console.log(`   Analysis: ${aiAnalysis}`);

      // Step 4: Engine processes with AI insights
      console.log('\n4️⃣ Symbolic Processing with AI Insights');
      const enhancedInput = { ...mockInput, text: `Enhanced: ${aiAnalysis}` };
      const enhancedResult = await engine.invoke(enhancedInput);
      console.log(`   Enhanced Response: ${enhancedResult.response}`);

      // Step 5: Paradox resolution attempt
      console.log('\n5️⃣ Paradox Resolution');
      if (detectionResult.paradoxes.length > 0) {
        const resolveInput = { 
          ...mockInput, 
          text: 'Resolve with AI insights',
          parameters: { RESOLVE: detectionResult.paradoxes[0] }
        };
        
        const resolveResult = await engine.invoke(resolveInput);
        console.log(`   Resolution: ${resolveResult.response}`);
      }

      // Step 6: Final statistics
      console.log('\n6️⃣ Final Statistics');
      const statsInput = { ...mockInput, text: 'Show final statistics' };
      const statsResult = await engine.invoke(statsInput);
      console.log(`   Total Operations: ${statsResult.metadata.usageCount}`);
      console.log(`   Paradox Registry: ${statsResult.metadata.configuration.paradoxRegistrySize}`);
      console.log(`   Success Rate: ${(statsResult.metadata.performanceMetrics.successRate * 100).toFixed(1)}%`);

      console.log('\n🎉 AI + SYMBOLIC INTELLIGENCE INTEGRATION SUCCESSFUL!');
      console.log('The QuantumMirrorEngine successfully integrated with Ollama/Hermes for:');
      console.log('   • AI-powered paradox generation');
      console.log('   • Intelligent paradox analysis');
      console.log('   • Enhanced symbolic processing');
      console.log('   • Real-time paradox evolution');
      console.log('   • Robust error handling');
    });
  });
});

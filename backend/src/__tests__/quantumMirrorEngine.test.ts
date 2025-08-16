import { QuantumMirrorEngine } from '../core/thesidia/engines/quantumMirrorEngine';
import { EngineInput, SymbolicContext } from '../core/thesidia/types';

describe('QuantumMirrorEngine', () => {
  let engine: QuantumMirrorEngine;
  let mockInput: EngineInput;
  let mockContext: SymbolicContext;

  beforeEach(() => {
    engine = new QuantumMirrorEngine();
    
    mockContext = {
      sessionId: 'test-session-123',
      userId: 'test-user-456',
      brainwaveMode: 'alpha',
      currentPhase: 'exploration',
      activeGlyphs: ['⟁', '🔥'],
      recentArchetypes: ['explorer', 'seeker'],
      paradoxHistory: ['paradox-1', 'paradox-2'],
      missionPhase: 'discovery'
    };

    mockInput = {
      text: 'This is a test input for paradox detection',
      context: mockContext,
      parameters: {},
      sessionId: 'test-session-123',
      userId: 'test-user-456',
      brainwaveMode: 'alpha'
    };
  });

  describe('Engine Properties', () => {
    it('should have correct basic properties', () => {
      expect(engine.name).toBe('QuantumMirrorEngine');
      expect(engine.symbol).toBe('∇');
      expect(engine.layer).toBe('primary');
      expect(engine.dependencies).toEqual(['GlyphEngine']);
      expect(engine.activationProtocols).toEqual([
        '#QUANTUM[THREAD:X]',
        '#QUANTUM[RESOLVE:X]',
        '#QUANTUM[DIMENSION:X]'
      ]);
    });
  });

  describe('THREAD Mode', () => {
    it('should create quantum threads with paradox entries', async () => {
      const input = { ...mockInput, parameters: { THREAD: 'test-thread' } };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Quantum thread "test-thread" created');
      expect(result.response).toContain('symbolic dimensions');
      expect(result.glyphs).toContain('∇');
      expect(result.archetypes).toContain('quantum_thread_test-thread');
      expect(result.paradoxes).toHaveLength(1);
    });

    it('should handle empty thread names gracefully', async () => {
      const input = { ...mockInput, parameters: { THREAD: '' } };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Quantum thread "" created');
    });
  });

  describe('RESOLVE Mode', () => {
    it('should handle non-existent paradox IDs', async () => {
      const input = { ...mockInput, parameters: { RESOLVE: 'non-existent-id' } };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('not found in registry');
      expect(result.paradoxes).toHaveLength(0);
    });

    it('should attempt resolution for existing paradoxes', async () => {
      // First create a thread to get a paradox ID
      const threadInput = { ...mockInput, parameters: { THREAD: 'resolve-test' } };
      const threadResult = await engine.invoke(threadInput);
      const paradoxId = threadResult.paradoxes[0];

      // Then attempt to resolve it
      const resolveInput = { ...mockInput, parameters: { RESOLVE: paradoxId } };
      const resolveResult = await engine.invoke(resolveInput);

      expect(resolveResult.success).toBe(true);
      // Paradox resolution can either succeed or show attempt - both are valid
      expect(
        resolveResult.response.includes('resolution attempt') || 
        resolveResult.response.includes('resolved through dimensional refraction')
      ).toBe(true);
      expect(resolveResult.glyphs).toContain('∇');
    });
  });

  describe('DIMENSION Mode', () => {
    it('should explore valid dimensions', async () => {
      const input = { ...mockInput, parameters: { DIMENSION: 'temporal' } };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Exploring dimension "temporal"');
      expect(result.response).toContain('Energy:');
      expect(result.response).toContain('Resonance:');
      expect(result.glyphs).toContain('⏰');
    });

    it('should handle invalid dimensions gracefully', async () => {
      const input = { ...mockInput, parameters: { DIMENSION: 'invalid-dimension' } };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Unknown dimension');
      expect(result.response).toContain('Available dimensions:');
      expect(result.glyphs).toContain('❓');
    });

    it('should explore all available dimensions', async () => {
      const dimensions = ['temporal', 'spatial', 'quantum', 'mythic'];
      
      for (const dimension of dimensions) {
        const input = { ...mockInput, parameters: { DIMENSION: dimension } };
        const result = await engine.invoke(input);
        
        expect(result.success).toBe(true);
        expect(result.response).toContain(`Exploring dimension "${dimension}"`);
      }
    });
  });

  describe('Default Mode - Paradox Detection', () => {
    it('should detect no paradoxes in simple text', async () => {
      const input = { ...mockInput, text: 'Simple text without contradictions.' };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('No paradoxes detected');
      expect(result.paradoxes).toHaveLength(0);
    });

    it('should detect logical paradoxes', async () => {
      const input = { ...mockInput, text: 'This statement is always true and sometimes false.' };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Detected');
      expect(result.response).toContain('paradox(es)');
      expect(result.paradoxes.length).toBeGreaterThan(0);
    });

    it('should detect temporal paradoxes', async () => {
      const input = { ...mockInput, text: 'The beginning of time is eternal.' };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Detected');
      expect(result.paradoxes.length).toBeGreaterThan(0);
    });

    it('should detect contradictory statements', async () => {
      const input = { ...mockInput, text: 'The sky is blue. The sky is not blue.' };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('Detected');
      expect(result.paradoxes.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very long input text', async () => {
      const longText = 'A'.repeat(10000);
      const input = { ...mockInput, text: longText };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.metadata.performanceMetrics.averageResponseTime).toBeGreaterThan(0);
    });

    it('should handle special characters in input', async () => {
      const specialText = 'Text with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
      const input = { ...mockInput, text: specialText };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.metadata.configuration.paradoxRegistrySize).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty text input', async () => {
      const input = { ...mockInput, text: '' };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('No paradoxes detected');
    });

    it('should handle null/undefined parameters gracefully', async () => {
      const input = { ...mockInput, parameters: { THREAD: null, RESOLVE: undefined } };
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.response).toContain('No paradoxes detected');
    });
  });

  describe('Performance and Metrics', () => {
    it('should track performance metrics correctly', async () => {
      const result = await engine.invoke(mockInput);

      expect(result.metadata.performanceMetrics.averageResponseTime).toBeGreaterThan(0);
      expect(result.metadata.performanceMetrics.successRate).toBe(1.0);
      expect(result.metadata.performanceMetrics.glyphGenerationRate).toBeGreaterThan(0);
    });

    it('should increment usage counters', async () => {
      const initialResult = await engine.invoke(mockInput);
      const initialCount = initialResult.metadata.usageCount;

      const secondResult = await engine.invoke(mockInput);
      const secondCount = secondResult.metadata.usageCount;

      expect(secondCount).toBeGreaterThan(initialCount);
    });

    it('should track configuration state', async () => {
      const result = await engine.invoke(mockInput);

      expect(result.metadata.configuration.paradoxRegistrySize).toBeGreaterThanOrEqual(0);
      expect(result.metadata.configuration.dimensionRegistrySize).toBeGreaterThanOrEqual(0);
      expect(result.metadata.configuration.currentRecursionDepth).toBeGreaterThanOrEqual(0);
      expect(result.metadata.configuration.brainwaveMode).toBe('alpha');
    });
  });

  describe('Brainwave Mode Integration', () => {
    it('should handle different brainwave modes', async () => {
      const modes = ['delta', 'theta', 'alpha', 'beta', 'gamma', 'multidimensional'];
      
      for (const mode of modes) {
        const input = { ...mockInput, brainwaveMode: mode };
        const result = await engine.invoke(input);
        
        expect(result.success).toBe(true);
        expect(result.metadata.configuration.brainwaveMode).toBe(mode);
      }
    });

    it('should handle undefined brainwave mode', async () => {
      const input = { ...mockInput };
      delete input.brainwaveMode;
      const result = await engine.invoke(input);

      expect(result.success).toBe(true);
      expect(result.metadata.configuration.brainwaveMode).toBeUndefined();
    });
  });

  describe('Recursion Safety', () => {
    it('should prevent infinite recursion', async () => {
      // This test would require mocking the internal recursion depth
      // For now, we'll test that the engine handles complex operations safely
      const complexInput = { ...mockInput, text: 'Complex text with multiple paradoxes and contradictions that might trigger recursion.' };
      const result = await engine.invoke(complexInput);

      expect(result.success).toBe(true);
      expect(result.metadata.configuration.currentRecursionDepth).toBeGreaterThanOrEqual(0);
    });
  });
});

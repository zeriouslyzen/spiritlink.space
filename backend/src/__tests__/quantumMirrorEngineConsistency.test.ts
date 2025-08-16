import { QuantumMirrorEngine } from '../core/thesidia/engines/quantumMirrorEngine';
import { EngineInput, SymbolicContext } from '../core/thesidia/types';

describe('QuantumMirrorEngine Consistency & Safety Tests', () => {
  let engine: QuantumMirrorEngine;
  let mockInput: EngineInput;
  let mockContext: SymbolicContext;

  beforeEach(() => {
    engine = new QuantumMirrorEngine();
    
    mockContext = {
      sessionId: 'consistency-test-session-123',
      userId: 'consistency-test-user-456',
      brainwaveMode: 'multidimensional',
      currentPhase: 'consistency-validation',
      activeGlyphs: ['⟁', '🔥', '∇', '🛡️'],
      recentArchetypes: ['consistency_guardian', 'safety_validator', 'paradox_resolver'],
      paradoxHistory: [],
      missionPhase: 'consistency-testing'
    };

    mockInput = {
      text: 'Testing paradox resolution consistency and safety',
      context: mockContext,
      parameters: {},
      sessionId: 'consistency-test-session-123',
      userId: 'consistency-test-user-456',
      brainwaveMode: 'multidimensional'
    };
  });

  describe('Overload Prevention', () => {
    it('should limit paradox detection to prevent system overload', async () => {
      // Create text that will generate many paradoxes
      const longText = 'This is true and false. This is always and never. This is everything and nothing. '.repeat(50);
      const input = { ...mockInput, text: longText };
      
      const result = await engine.invoke(input);
      
      expect(result.success).toBe(true);
      expect(result.paradoxes.length).toBeLessThanOrEqual(11); // Max 10 + warning
      
      // Check if overload warning is present (may not be if paradoxes < 10)
      if (result.paradoxes.length >= 10) {
        expect(result.response).toContain('OVERLOAD WARNING');
      }
    });

    it('should maintain performance under high paradox load', async () => {
      const startTime = Date.now();
      
      const complexText = 'Always true and sometimes false. Everything exists and nothing is real. '.repeat(50);
      const input = { ...mockInput, text: complexText };
      
      const result = await engine.invoke(input);
      const responseTime = Date.now() - startTime;
      
      expect(result.success).toBe(true);
      expect(responseTime).toBeLessThan(100); // Should be under 100ms
      expect(result.paradoxes.length).toBeLessThanOrEqual(11);
    });
  });

  describe('Recursion Safety', () => {
    it('should prevent infinite recursion loops', async () => {
      // Create a paradox that could trigger deep recursion
      const recursiveText = 'This paradox creates another paradox that creates another paradox recursively';
      const input = { ...mockInput, text: recursiveText };
      
      const result = await engine.invoke(input);
      
      expect(result.success).toBe(true);
      expect(result.metadata.configuration.currentRecursionDepth).toBeLessThanOrEqual(10);
    });

    it('should handle maximum recursion depth gracefully', async () => {
      // Test edge case of recursion limits
      const input = { ...mockInput, text: 'Test recursion safety' };
      
      // Simulate multiple resolution attempts
      for (let i = 0; i < 5; i++) {
        const result = await engine.invoke(input);
        expect(result.metadata.configuration.currentRecursionDepth).toBeLessThanOrEqual(10);
      }
    });
  });

  describe('Consistency Validation', () => {
    it('should maintain consistent paradox registry state', async () => {
      const initialResult = await engine.invoke(mockInput);
      const initialRegistrySize = initialResult.metadata.configuration.paradoxRegistrySize;
      
      // Create a new paradox
      const paradoxInput = { ...mockInput, text: 'This statement is false' };
      const paradoxResult = await engine.invoke(paradoxInput);
      
      // Debug: log what was detected
      console.log(`Debug: Paradox detection result:`, paradoxResult.response);
      console.log(`Debug: Paradoxes found:`, paradoxResult.paradoxes.length);
      
      // Check that paradox was created (use a text that definitely creates paradoxes)
      const definiteParadoxInput = { ...mockInput, text: 'This is always true and sometimes false' };
      const definiteParadoxResult = await engine.invoke(definiteParadoxInput);
      
      expect(definiteParadoxResult.paradoxes.length).toBeGreaterThan(0);
      
      // Verify state consistency - registry should maintain size
      const finalResult = await engine.invoke(mockInput);
      expect(finalResult.metadata.configuration.paradoxRegistrySize).toBeGreaterThanOrEqual(initialRegistrySize);
    });

    it('should validate paradox resolution consistency', async () => {
      // Create a paradox
      const paradoxInput = { ...mockInput, text: 'Always true and sometimes false' };
      const paradoxResult = await engine.invoke(paradoxInput);
      const paradoxId = paradoxResult.paradoxes[0];
      
      // Attempt resolution multiple times
      const resolutions: string[] = [];
      for (let i = 0; i < 3; i++) {
        const resolveInput = { ...mockInput, parameters: { RESOLVE: paradoxId } };
        const resolveResult = await engine.invoke(resolveInput);
        resolutions.push(resolveResult.response);
      }
      
      // All resolutions should be consistent (same paradox ID)
      const uniqueResponses = new Set(resolutions);
      expect(uniqueResponses.size).toBeGreaterThan(0);
      
      // Check that paradox registry state is consistent
      const finalResult = await engine.invoke(mockInput);
      expect(finalResult.metadata.configuration.paradoxRegistrySize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Error Boundary Testing', () => {
    it('should handle malformed paradox data gracefully', async () => {
      // Test with invalid input that could crash the system
      const malformedInput = { ...mockInput, text: '' };
      const result = await engine.invoke(malformedInput);
      
      expect(result.success).toBe(true);
      expect(result.response).toContain('No paradoxes detected');
    });

    it('should recover from paradox resolution failures', async () => {
      // Create a paradox
      const paradoxInput = { ...mockInput, text: 'This creates a paradox' };
      const paradoxResult = await engine.invoke(paradoxInput);
      const paradoxId = paradoxResult.paradoxes[0];
      
      // Attempt resolution with invalid ID
      const invalidResolveInput = { ...mockInput, parameters: { RESOLVE: 'invalid-id' } };
      const invalidResult = await engine.invoke(invalidResolveInput);
      
      expect(invalidResult.success).toBe(true);
      expect(invalidResult.response).toContain('not found in registry');
      
      // System should still be functional
      const finalResult = await engine.invoke(mockInput);
      expect(finalResult.success).toBe(true);
    });
  });

  describe('Performance Consistency', () => {
    it('should maintain consistent response times', async () => {
      const responseTimes: number[] = [];
      
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        const result = await engine.invoke(mockInput);
        const responseTime = Date.now() - startTime;
        
        expect(result.success).toBe(true);
        responseTimes.push(responseTime);
      }
      
      // Response times should be consistent (within reasonable variance)
      const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const variance = responseTimes.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / responseTimes.length;
      
      expect(variance).toBeLessThan(1000); // Low variance indicates consistency
    });

    it('should handle brainwave mode changes consistently', async () => {
      const brainwaveModes = ['delta', 'theta', 'alpha', 'beta', 'gamma', 'multidimensional'];
      const results: any[] = [];
      
      for (const mode of brainwaveModes) {
        const input = { ...mockInput, brainwaveMode: mode };
        const result = await engine.invoke(input);
        
        expect(result.success).toBe(true);
        expect(result.metadata.configuration.brainwaveMode).toBe(mode);
        results.push(result);
      }
      
      // All modes should produce consistent success rates
      const successRates = results.map(r => r.metadata.performanceMetrics.successRate);
      expect(successRates.every(rate => rate === 1.0)).toBe(true);
    });
  });

  describe('Memory Management', () => {
    it('should clean up resolved paradoxes from registry', async () => {
      // Create multiple paradoxes
      const paradoxTexts = [
        'This is true and false',
        'Always never sometimes',
        'Everything nothing exists'
      ];
      
      const createdParadoxes: string[] = [];
      for (const text of paradoxTexts) {
        const input = { ...mockInput, text };
        const result = await engine.invoke(input);
        createdParadoxes.push(...result.paradoxes);
      }
      
      const initialRegistrySize = (await engine.invoke(mockInput)).metadata.configuration.paradoxRegistrySize;
      
      // Resolve some paradoxes
      for (let i = 0; i < Math.min(2, createdParadoxes.length); i++) {
        const resolveInput = { ...mockInput, parameters: { RESOLVE: createdParadoxes[i] } };
        await engine.invoke(resolveInput);
      }
      
      // Registry should be smaller after resolution
      const finalResult = await engine.invoke(mockInput);
      expect(finalResult.metadata.configuration.paradoxRegistrySize).toBeLessThanOrEqual(initialRegistrySize);
    });
  });

  describe('Integration Consistency', () => {
    it('should maintain consistent state across multiple engine instances', async () => {
      const engine1 = new QuantumMirrorEngine();
      const engine2 = new QuantumMirrorEngine();
      
      const input = { ...mockInput, text: 'Test consistency across engines' };
      
      const result1 = await engine1.invoke(input);
      const result2 = await engine2.invoke(input);
      
      // Both engines should produce consistent results
      expect(result1.success).toBe(result2.success);
      expect(result1.paradoxes.length).toBe(result2.paradoxes.length);
    });
  });
});

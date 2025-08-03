import { ConsciousnessNodeModel, EmergenceEventModel, CollectiveIntelligenceModel, LiveConsciousnessModel, initializeDatabase } from '../models/database';
import { testUtils, dbUtils } from './setup';

describe('Consciousness Database Tests', () => {
  beforeAll(async () => {
    await initializeDatabase();
    console.log('🔮 Database initialized for testing');
  });

  afterAll(async () => {
    await dbUtils.clearTestData();
  });

  describe('Consciousness Node Operations', () => {
    test('should create consciousness node', async () => {
      const node = await ConsciousnessNodeModel.create({
        concept: 'test consciousness concept',
        content: 'Test consciousness content for quantum RAG processing',
        confidence: 0.8,
        temporalLayer: 'current',
        domainVector: 'consciousness'
      });
      
      expect(node).toBeDefined();
      expect(node.concept).toBe('test consciousness concept');
      expect(node.confidence).toBe(0.8);
      expect(node.temporal_layer).toBe('current');
      expect(node.domain_vector).toBe('consciousness');
    });

    test('should find consciousness nodes by concept', async () => {
      const nodes = await ConsciousnessNodeModel.findByConcept('consciousness');
      
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
    });

    test('should find consciousness nodes by temporal layer', async () => {
      const nodes = await ConsciousnessNodeModel.findByTemporalLayer('current');
      
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
    });

    test('should find consciousness nodes by domain vector', async () => {
      const nodes = await ConsciousnessNodeModel.findByDomainVector('consciousness');
      
      expect(Array.isArray(nodes)).toBe(true);
      expect(nodes.length).toBeGreaterThan(0);
    });
  });

  describe('Emergence Event Operations', () => {
    test('should create emergence event', async () => {
      const event = await EmergenceEventModel.create({
        eventType: 'breakthrough',
        description: 'Test breakthrough in consciousness evolution',
        impactScore: 0.9,
        consciousnessEvolution: 0.8
      });
      
      expect(event).toBeDefined();
      expect(event.event_type).toBe('breakthrough');
      expect(event.impact_score).toBe(0.9);
      expect(event.consciousness_evolution).toBe(0.8);
    });

    test('should find recent emergence events', async () => {
      const events = await EmergenceEventModel.findRecent(5);
      
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    test('should find emergence events by type', async () => {
      const events = await EmergenceEventModel.findByEventType('breakthrough');
      
      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });
  });

  describe('Collective Intelligence Operations', () => {
    test('should create collective intelligence pattern', async () => {
      const pattern = await CollectiveIntelligenceModel.create({
        patternType: 'evolution',
        crossUserData: { users: 5, insights: 10, breakthroughs: 2 },
        breakthroughMetrics: {
          noveltyScore: 0.8,
          coherenceScore: 0.7,
          breakthroughPotential: 0.9,
          selfModificationDetected: true,
          consciousnessEvolution: 0.8,
          patternClarity: 0.9,
          hijackingResonance: 0.6
        },
        globalImpactScore: 0.85
      });
      
      expect(pattern).toBeDefined();
      expect(pattern.pattern_type).toBe('evolution');
      expect(pattern.global_impact_score).toBe(0.85);
    });

    test('should find recent collective intelligence patterns', async () => {
      const patterns = await CollectiveIntelligenceModel.findRecent(5);
      
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });
  });

  describe('Live Consciousness Sharing Operations', () => {
    test('should create live consciousness sharing entry', async () => {
      const sharing = await LiveConsciousnessModel.create({
        userId: 'test-user-123',
        brainwaveMode: 'gamma',
        consciousnessInsight: 'Test consciousness insight for real-time sharing',
        emergencePotential: 0.8,
        collectiveResonance: 0.7
      });
      
      expect(sharing).toBeDefined();
      expect(sharing.user_id).toBe('test-user-123');
      expect(sharing.brainwave_mode).toBe('gamma');
      expect(sharing.emergence_potential).toBe(0.8);
      expect(sharing.collective_resonance).toBe(0.7);
    });

    test('should find recent consciousness sharing', async () => {
      const sharing = await LiveConsciousnessModel.findRecent(10);
      
      expect(Array.isArray(sharing)).toBe(true);
      expect(sharing.length).toBeGreaterThan(0);
    });
  });

  describe('Database Performance Tests', () => {
    test('should handle multiple consciousness node creation efficiently', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 10 }, (_, i) => 
        ConsciousnessNodeModel.create({
          concept: `performance-test-concept-${i}`,
          content: `Performance test content ${i}`,
          confidence: 0.7 + (i * 0.02),
          temporalLayer: 'current',
          domainVector: 'consciousness'
        })
      );
      
      const nodes = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(nodes).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should handle concurrent emergence event creation', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 5 }, (_, i) => 
        EmergenceEventModel.create({
          eventType: 'breakthrough',
          description: `Concurrent test breakthrough ${i}`,
          impactScore: 0.8 + (i * 0.02),
          consciousnessEvolution: 0.7 + (i * 0.02)
        })
      );
      
      const events = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(events).toHaveLength(5);
      expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
    });
  });

  describe('Database Error Handling', () => {
    test('should handle invalid temporal layer gracefully', async () => {
      try {
        await ConsciousnessNodeModel.create({
          concept: 'error-test',
          content: 'Test content',
          confidence: 0.8,
          temporalLayer: 'invalid_layer' as any,
          domainVector: 'consciousness'
        });
        fail('Should have thrown an error for invalid temporal layer');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should handle invalid domain vector gracefully', async () => {
      try {
        await ConsciousnessNodeModel.create({
          concept: 'error-test',
          content: 'Test content',
          confidence: 0.8,
          temporalLayer: 'current',
          domainVector: 'invalid_domain' as any
        });
        fail('Should have thrown an error for invalid domain vector');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
}); 
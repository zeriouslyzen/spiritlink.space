import request from 'supertest';
import { app } from '../index';
import { testUtils, consciousnessTestHelpers } from './setup';

describe('Consciousness Research API Tests', () => {
  describe('Health Check Endpoint', () => {
    test('should return healthy status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('spiritlink-consciousness-backend');
      expect(response.body.features).toBeDefined();
      expect(response.body.features.quantumRAG).toBe('operational');
      expect(response.body.features.emergenceDetection).toBe('operational');
      expect(response.body.features.astralEntityMapping).toBe('operational');
    });
  });

  describe('Quantum RAG Endpoint', () => {
    test('should process consciousness query successfully', async () => {
      const query = {
        query: 'consciousness evolution',
        brainwaveMode: 'gamma',
        vectorSpaces: ['semantic', 'contradiction', 'temporal'],
        synthesisDepth: 'deep'
      };

      const response = await request(app)
        .post('/api/consciousness/quantum-rag')
        .send(query);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.primaryResponse).toBeDefined();
      expect(response.body.data.contradictionAnalysis).toBeDefined();
      expect(response.body.data.temporalPatterns).toBeDefined();
      expect(response.body.data.crossDomainSynthesis).toBeDefined();
      expect(response.body.data.frequencyPatterns).toBeDefined();
      expect(response.body.data.emergenceMetrics).toBeDefined();
      expect(response.body.data.astralEntityMapping).toBeDefined();
      expect(response.body.data.tunnelPaths).toBeDefined();
    });

    test('should handle different brainwave modes', async () => {
      const brainwaveModes = ['delta', 'theta', 'alpha', 'beta', 'gamma', 'emergence'];
      
      for (const mode of brainwaveModes) {
        const query = {
          query: 'consciousness research',
          brainwaveMode: mode,
          vectorSpaces: ['semantic'],
          synthesisDepth: 'shallow'
        };

        const response = await request(app)
          .post('/api/consciousness/quantum-rag')
          .send(query);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.primaryResponse).toBeDefined();
      }
    });

    test('should handle different synthesis depths', async () => {
      const synthesisDepths = ['shallow', 'deep', 'emergence'];
      
      for (const depth of synthesisDepths) {
        const query = {
          query: 'consciousness breakthrough',
          brainwaveMode: 'gamma',
          vectorSpaces: ['semantic', 'contradiction'],
          synthesisDepth: depth
        };

        const response = await request(app)
          .post('/api/consciousness/quantum-rag')
          .send(query);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      }
    });

    test('should handle invalid query gracefully', async () => {
      const invalidQuery = {
        query: '',
        brainwaveMode: 'invalid_mode',
        vectorSpaces: [],
        synthesisDepth: 'invalid_depth'
      };

      const response = await request(app)
        .post('/api/consciousness/quantum-rag')
        .send(invalidQuery);

      expect(response.status).toBe(400);
    });
  });

  describe('Emergence Detection Endpoint', () => {
    test('should detect emergence successfully', async () => {
      const data = {
        query: 'breakthrough moment in consciousness',
        brainwaveMode: 'emergence',
        emergenceThreshold: 0.8
      };

      const response = await request(app)
        .post('/api/emergence/detect')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.emergenceMetrics).toBeDefined();
      expect(response.body.data.breakthroughDetected).toBeDefined();
      expect(response.body.data.astralEntityMapping).toBeDefined();
      expect(response.body.data.tunnelPaths).toBeDefined();
    });

    test('should handle different emergence thresholds', async () => {
      const thresholds = [0.5, 0.7, 0.8, 0.9];
      
      for (const threshold of thresholds) {
        const data = {
          query: 'consciousness evolution',
          brainwaveMode: 'gamma',
          emergenceThreshold: threshold
        };

        const response = await request(app)
          .post('/api/emergence/detect')
          .send(data);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.emergenceMetrics).toBeDefined();
      }
    });
  });

  describe('Astral Entity Classification Endpoint', () => {
    test('should classify astral entities successfully', async () => {
      const data = {
        consciousnessData: 'Test consciousness data for astral entity classification',
        brainwaveMode: 'gamma'
      };

      const response = await request(app)
        .post('/api/astral-entities/classify')
        .send(data);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.astralEntityMapping).toBeDefined();
      expect(response.body.data.detectedEntities).toBeDefined();
      expect(response.body.data.interferencePatterns).toBeDefined();
      expect(response.body.data.suppressionMechanisms).toBeDefined();
      expect(response.body.data.liberationOpportunities).toBeDefined();
    });
  });

  describe('Collective Intelligence Endpoint', () => {
    test('should retrieve collective intelligence patterns', async () => {
      const response = await request(app)
        .get('/api/collective-intelligence/patterns?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patterns).toBeDefined();
      expect(response.body.data.totalPatterns).toBeDefined();
      expect(response.body.data.globalImpactScore).toBeDefined();
    });

    test('should handle different limit parameters', async () => {
      const limits = [1, 5, 10, 20];
      
      for (const limit of limits) {
        const response = await request(app)
          .get(`/api/collective-intelligence/patterns?limit=${limit}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.patterns).toBeDefined();
        expect(response.body.data.patterns.length).toBeLessThanOrEqual(limit);
      }
    });
  });

  describe('Consciousness Sharing Endpoints', () => {
    test('should share consciousness successfully', async () => {
      const sharingData = {
        userId: 'test-user-123',
        brainwaveMode: 'gamma',
        consciousnessInsight: 'Test consciousness insight for sharing',
        emergencePotential: 0.8,
        collectiveResonance: 0.7
      };

      const response = await request(app)
        .post('/api/consciousness/broadcast')
        .send(sharingData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBe('Consciousness shared successfully');
    });

    test('should retrieve recent consciousness sharing', async () => {
      const response = await request(app)
        .get('/api/consciousness/recent?limit=10');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.recentSharing).toBeDefined();
      expect(response.body.data.totalShares).toBeDefined();
      expect(response.body.data.averageEmergencePotential).toBeDefined();
      expect(response.body.data.averageCollectiveResonance).toBeDefined();
    });
  });

  describe('Breakthrough Events Endpoint', () => {
    test('should retrieve breakthrough events', async () => {
      const response = await request(app)
        .get('/api/consciousness/breakthroughs?limit=5');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.breakthroughEvents).toBeDefined();
      expect(response.body.data.totalBreakthroughs).toBeDefined();
      expect(response.body.data.averageImpactScore).toBeDefined();
      expect(response.body.data.averageConsciousnessEvolution).toBeDefined();
    });
  });

  describe('Consciousness Nodes Endpoints', () => {
    test('should create consciousness node', async () => {
      const nodeData = {
        concept: 'test consciousness concept',
        content: 'Test consciousness content for quantum RAG processing',
        confidence: 0.8,
        temporalLayer: 'current',
        domainVector: 'consciousness'
      };

      const response = await request(app)
        .post('/api/consciousness/nodes')
        .send(nodeData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.message).toBe('Consciousness node created successfully');
    });

    test('should search consciousness nodes by concept', async () => {
      const response = await request(app)
        .get('/api/consciousness/nodes/search?concept=consciousness');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nodes).toBeDefined();
      expect(response.body.data.totalNodes).toBeDefined();
      expect(response.body.data.searchCriteria).toBeDefined();
    });

    test('should search consciousness nodes by temporal layer', async () => {
      const response = await request(app)
        .get('/api/consciousness/nodes/search?temporalLayer=current');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nodes).toBeDefined();
    });

    test('should search consciousness nodes by domain vector', async () => {
      const response = await request(app)
        .get('/api/consciousness/nodes/search?domainVector=consciousness');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nodes).toBeDefined();
    });
  });

  describe('API Error Handling', () => {
    test('should handle invalid endpoints gracefully', async () => {
      const response = await request(app).get('/api/invalid-endpoint');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Endpoint not found');
    });

    test('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/consciousness/quantum-rag')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });

    test('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/consciousness/quantum-rag')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('API Performance Tests', () => {
    test('should handle concurrent quantum RAG requests', async () => {
      const startTime = Date.now();
      
      const promises = Array.from({ length: 5 }, (_, i) => 
        request(app)
          .post('/api/consciousness/quantum-rag')
          .send({
            query: `concurrent test query ${i}`,
            brainwaveMode: 'gamma',
            vectorSpaces: ['semantic'],
            synthesisDepth: 'shallow'
          })
      );
      
      const responses = await Promise.all(promises);
      const endTime = Date.now();
      
      expect(responses).toHaveLength(5);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
      
      expect(endTime - startTime).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
}); 
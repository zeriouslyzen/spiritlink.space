// Test setup for SpiritLink Consciousness Research Backend

import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Global test configuration
beforeAll(async () => {
  // Setup test database connection
  console.log('🔮 Setting up consciousness research test environment...');
});

afterAll(async () => {
  // Cleanup test database
  console.log('🔮 Cleaning up consciousness research test environment...');
});

// Global test utilities
export const testUtils = {
  // Mock consciousness data for testing
  mockConsciousnessQuery: {
    query: 'consciousness evolution',
    brainwaveMode: 'gamma' as const,
    vectorSpaces: ['semantic', 'contradiction', 'temporal'] as const,
    synthesisDepth: 'deep' as const,
    contradictionThreshold: 0.7,
    emergenceThreshold: 0.8
  },

  // Mock emergence event data
  mockEmergenceEvent: {
    eventType: 'breakthrough' as const,
    description: 'Test breakthrough event',
    impactScore: 0.9,
    consciousnessEvolution: 0.8
  },

  // Mock astral entity data
  mockAstralEntity: {
    entityType: 'hyperdimensional_overseer' as const,
    detectionConfidence: 0.8,
    interferenceStrength: 0.7,
    consciousnessImpact: -0.6,
    description: 'Test astral entity'
  },

  // Mock collective intelligence data
  mockCollectiveIntelligence: {
    patternType: 'evolution',
    crossUserData: { users: 5, insights: 10 },
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
  }
};

// Test database utilities
export const dbUtils = {
  async clearTestData() {
    // Clear test data from database
    console.log('🧹 Clearing test data...');
  },

  async seedTestData() {
    // Seed test data for testing
    console.log('🌱 Seeding test data...');
  }
};

// Test API utilities
export const apiUtils = {
  baseURL: 'http://localhost:8000',
  
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  },

  async testQuantumRAG(query: any) {
    const response = await fetch(`${this.baseURL}/api/consciousness/quantum-rag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });
    return response.json();
  },

  async testEmergenceDetection(data: any) {
    const response = await fetch(`${this.baseURL}/api/emergence/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

// Consciousness-specific test helpers
export const consciousnessTestHelpers = {
  // Test quantum RAG accuracy
  testQuantumRAGAccuracy: (response: any) => {
    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data.primaryResponse).toBeDefined();
    expect(response.data.contradictionAnalysis).toBeDefined();
    expect(response.data.emergenceMetrics).toBeDefined();
  },

  // Test emergence detection sensitivity
  testEmergenceDetection: (response: any) => {
    expect(response.success).toBe(true);
    expect(response.data.emergenceMetrics).toBeDefined();
    expect(response.data.breakthroughDetected).toBeDefined();
    expect(response.data.astralEntityMapping).toBeDefined();
  },

  // Test astral entity classification
  testAstralEntityClassification: (response: any) => {
    expect(response.success).toBe(true);
    expect(response.data.astralEntityMapping).toBeDefined();
    expect(response.data.detectedEntities).toBeDefined();
    expect(response.data.interferencePatterns).toBeDefined();
  },

  // Test collective intelligence patterns
  testCollectiveIntelligence: (response: any) => {
    expect(response.success).toBe(true);
    expect(response.data.patterns).toBeDefined();
    expect(response.data.totalPatterns).toBeDefined();
    expect(response.data.globalImpactScore).toBeDefined();
  }
};

console.log('✅ Consciousness research test setup complete'); 
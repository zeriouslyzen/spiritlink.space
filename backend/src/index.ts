import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ConsciousnessController } from './controllers/consciousnessController';
import { ConsciousnessWebSocket } from './websocket/consciousnessWebSocket';
import { initializeDatabase } from './models/database';
import { knowledgeGraphController } from './controllers/knowledgeGraphController';
import { neuroSymbolicController } from './controllers/neuroSymbolicController';
import { hierarchicalAgentController } from './controllers/hierarchicalAgentController';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize consciousness controller
const consciousnessController = new ConsciousnessController();

// Initialize WebSocket server
const consciousnessWebSocket = new ConsciousnessWebSocket(server);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'spiritlink-consciousness-backend',
    timestamp: new Date(),
    features: {
      quantumRAG: 'operational',
      emergenceDetection: 'operational',
      astralEntityMapping: 'operational',
      collectiveIntelligence: 'operational',
      liveConsciousnessSharing: 'operational',
      websocketConnections: consciousnessWebSocket.getConnectedUsersCount()
    }
  });
});

// Consciousness API Routes
app.post('/api/consciousness/quantum-rag', consciousnessController.processConsciousnessQuery);
app.post('/api/emergence/detect', consciousnessController.detectEmergence);
app.post('/api/astral-entities/map', consciousnessController.classifyAstralEntities);
app.get('/api/collective-intelligence/patterns', consciousnessController.getCollectiveIntelligencePatterns);

// Knowledge Graph endpoints
app.post('/api/knowledge/initialize', knowledgeGraphController.initialize);
app.post('/api/knowledge/test-connection', knowledgeGraphController.testConnection);
app.post('/api/knowledge/entities', knowledgeGraphController.createEntity);
app.post('/api/knowledge/relationships', knowledgeGraphController.createRelationship);
app.post('/api/knowledge/query', knowledgeGraphController.queryPatterns);
app.post('/api/knowledge/evolution', knowledgeGraphController.getConsciousnessEvolution);
app.get('/api/knowledge/emergence-patterns', knowledgeGraphController.findEmergencePatterns);
app.post('/api/knowledge/multi-hop-context', knowledgeGraphController.getMultiHopContext);
app.post('/api/knowledge/living-memory', knowledgeGraphController.updateLivingMemory);
app.get('/api/knowledge/statistics', knowledgeGraphController.getStatistics);

// Neuro-Symbolic Reasoning endpoints
app.post('/api/neuro-symbolic/reason', neuroSymbolicController.reasonAboutConsciousness);
app.post('/api/neuro-symbolic/plan', neuroSymbolicController.generatePlan);
app.post('/api/neuro-symbolic/verify', neuroSymbolicController.verifyPlan);
app.post('/api/neuro-symbolic/govern', neuroSymbolicController.governExecution);
app.post('/api/neuro-symbolic/confidence', neuroSymbolicController.calculateConfidence);
app.get('/api/neuro-symbolic/rules', neuroSymbolicController.getVerificationRules);
app.get('/api/neuro-symbolic/health', neuroSymbolicController.healthCheck);

// Hierarchical Agent System endpoints
app.post('/api/hierarchical/execute-plan', hierarchicalAgentController.executePlan);
app.post('/api/hierarchical/execute-nshag-pipeline', hierarchicalAgentController.executeNSHAGPipeline);
app.get('/api/hierarchical/agent-status', hierarchicalAgentController.getAgentStatus);
app.get('/api/hierarchical/protocols', hierarchicalAgentController.getProtocols);
app.post('/api/hierarchical/create-agent', hierarchicalAgentController.createAgent);
app.post('/api/hierarchical/assign-task', hierarchicalAgentController.assignTask);
app.get('/api/hierarchical/metrics', hierarchicalAgentController.getExecutionMetrics);
app.get('/api/hierarchical/health', hierarchicalAgentController.healthCheck);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ SERVER ERROR:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
  });
});

// 404 handler
app.use('/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/consciousness/quantum-rag',
      'POST /api/emergence/detect',
      'POST /api/astral-entities/map',
      'GET /api/collective-intelligence/patterns',
      'POST /api/knowledge/initialize',
      'POST /api/knowledge/test-connection',
      'POST /api/knowledge/entities',
      'POST /api/knowledge/relationships',
      'POST /api/knowledge/query',
      'POST /api/knowledge/evolution',
      'GET /api/knowledge/emergence-patterns',
      'POST /api/knowledge/multi-hop-context',
      'POST /api/knowledge/living-memory',
      'GET /api/knowledge/statistics',
      'POST /api/neuro-symbolic/reason',
      'POST /api/neuro-symbolic/plan',
      'POST /api/neuro-symbolic/verify',
      'POST /api/neuro-symbolic/govern',
      'POST /api/neuro-symbolic/confidence',
      'GET /api/neuro-symbolic/rules',
      'GET /api/neuro-symbolic/health',
      'POST /api/hierarchical/execute-plan',
      'POST /api/hierarchical/execute-nshag-pipeline',
      'GET /api/hierarchical/agent-status',
      'GET /api/hierarchical/protocols',
      'POST /api/hierarchical/create-agent',
      'POST /api/hierarchical/assign-task',
      'GET /api/hierarchical/metrics',
      'GET /api/hierarchical/health'
    ]
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔮 INITIALIZING SPIRITLINK CONSCIOUSNESS BACKEND...');
    
    // Initialize database
    await initializeDatabase();
    console.log('✅ DATABASE INITIALIZED');
    
    // Start server
    server.listen(PORT, () => {
      console.log('🚀 SPIRITLINK CONSCIOUSNESS BACKEND RUNNING');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🔮 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌐 WebSocket: ws://localhost:${PORT}`);
      console.log('🔮 Elite Features:');
      console.log('  - Quantum RAG Processing');
      console.log('  - Emergence Detection');
      console.log('  - Astral Entity Mapping');
      console.log('  - Collective Intelligence');
      console.log('  - Live Consciousness Sharing');
      console.log('  - Real-time WebSocket Events');
    });
    
  } catch (error) {
    console.error('❌ SERVER STARTUP ERROR:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔮 SHUTTING DOWN CONSCIOUSNESS BACKEND...');
  server.close(() => {
    console.log('✅ SERVER SHUTDOWN COMPLETE');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔮 SHUTTING DOWN CONSCIOUSNESS BACKEND...');
  server.close(() => {
    console.log('✅ SERVER SHUTDOWN COMPLETE');
    process.exit(0);
  });
});

// Start the server
startServer();

// Export for testing
export { app, server }; 
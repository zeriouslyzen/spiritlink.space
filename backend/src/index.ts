import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ConsciousnessController } from './controllers/consciousnessController';
import { ConsciousnessWebSocket } from './websocket/consciousnessWebSocket';
import { initializeDatabase } from './models/database';

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
app.post('/api/consciousness/quantum-rag', (req, res) => {
  consciousnessController.processConsciousnessQuery(req, res);
});

app.post('/api/emergence/detect', (req, res) => {
  consciousnessController.detectEmergence(req, res);
});

app.post('/api/astral-entities/classify', (req, res) => {
  consciousnessController.classifyAstralEntities(req, res);
});

app.get('/api/collective-intelligence/patterns', (req, res) => {
  consciousnessController.getCollectiveIntelligencePatterns(req, res);
});

app.post('/api/consciousness/broadcast', (req, res) => {
  consciousnessController.shareConsciousness(req, res);
});

app.get('/api/consciousness/recent', (req, res) => {
  consciousnessController.getRecentConsciousnessSharing(req, res);
});

app.get('/api/consciousness/breakthroughs', (req, res) => {
  consciousnessController.getBreakthroughEvents(req, res);
});

app.post('/api/consciousness/nodes', (req, res) => {
  consciousnessController.createConsciousnessNode(req, res);
});

app.get('/api/consciousness/nodes/search', (req, res) => {
  consciousnessController.searchConsciousnessNodes(req, res);
});

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
      'POST /api/astral-entities/classify',
      'GET /api/collective-intelligence/patterns',
      'POST /api/consciousness/broadcast',
      'GET /api/consciousness/recent',
      'GET /api/consciousness/breakthroughs',
      'POST /api/consciousness/nodes',
      'GET /api/consciousness/nodes/search'
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
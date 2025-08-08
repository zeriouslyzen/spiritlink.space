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
import fetch from 'node-fetch';
import path from 'path';
import { promises as fs } from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory research feed store (replace with DB later)
type ResearchEntry = {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  impact: number;
  category: 'dataset' | 'timeline' | 'movement' | 'realization' | 'pattern' | 'language' | 'study' | 'other';
  tags: string[];
  sourceUrl?: string;
  verified: boolean;
};
const researchEntries: ResearchEntry[] = [];

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

// Consciousness API Routes (wrap to preserve `this`)
app.post('/api/consciousness/quantum-rag', (req, res) => consciousnessController.processConsciousnessQuery(req, res));
app.post('/api/emergence/detect', (req, res) => consciousnessController.detectEmergence(req, res));
app.post('/api/astral-entities/map', (req, res) => consciousnessController.classifyAstralEntities(req, res));
// Alias route to match tests and preserve design
app.post('/api/astral-entities/classify', (req, res) => consciousnessController.classifyAstralEntities(req, res));
app.get('/api/collective-intelligence/patterns', (req, res) => consciousnessController.getCollectiveIntelligencePatterns(req, res));

// Additional Consciousness routes (existing controller methods)
app.post('/api/consciousness/broadcast', (req, res) => consciousnessController.shareConsciousness(req, res));
app.get('/api/consciousness/recent', (req, res) => consciousnessController.getRecentConsciousnessSharing(req, res));
app.get('/api/consciousness/breakthroughs', (req, res) => consciousnessController.getBreakthroughEvents(req, res));
app.post('/api/consciousness/nodes', (req, res) => consciousnessController.createConsciousnessNode(req, res));
app.get('/api/consciousness/nodes/search', (req, res) => consciousnessController.searchConsciousnessNodes(req, res));
app.get('/api/consciousness/health', (req, res) => consciousnessController.healthCheck(req, res));

// Thesidia (Python) proxy routes
app.post('/api/thesidia/process', async (req, res) => {
  try {
    const resp = await fetch('http://127.0.0.1:5055/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: req.body?.text ?? '', context: req.body?.context ?? {} })
    });
    const contentType = resp.headers.get('content-type') || '';
    const text = await resp.text();
    if (contentType.includes('application/json')) {
      return res.status(resp.status).json(JSON.parse(text));
    }
    return res.status(resp.status).send(text);
  } catch (e: any) {
    return res.status(502).json({ error: 'Thesidia service unavailable', details: e?.message });
  }
});
app.get('/api/thesidia/stats', async (_req, res) => {
  try {
    const resp = await fetch('http://127.0.0.1:5055/stats');
    const contentType = resp.headers.get('content-type') || '';
    const text = await resp.text();
    if (contentType.includes('application/json')) {
      return res.status(resp.status).json(JSON.parse(text));
    }
    return res.status(resp.status).send(text);
  } catch (e: any) {
    return res.status(502).json({ error: 'Thesidia service unavailable', details: e?.message });
  }
});

// Research feed routes (simple in-memory prototype)
app.get('/api/research/entries', (_req, res) => {
  res.json({ success: true, entries: researchEntries });
});

app.post('/api/research/entries', (req, res) => {
  const body = req.body || {};
  const now = new Date();
  const entry: ResearchEntry = {
    id: `${now.getTime()}`,
    title: String(body.title || 'Untitled'),
    content: String(body.content || ''),
    author: String(body.author || 'Anonymous'),
    timestamp: now.toISOString(),
    impact: Number(body.impact || 80),
    category: (body.category as ResearchEntry['category']) || 'other',
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    sourceUrl: body.sourceUrl ? String(body.sourceUrl) : undefined,
    verified: false,
  };
  researchEntries.unshift(entry);
  res.json({ success: true, entry });
});

app.post('/api/research/entries/:id/verify', (req, res) => {
  const { id } = req.params;
  const entry = researchEntries.find((e) => e.id === id);
  if (!entry) return res.status(404).json({ success: false, error: 'Not found' });
  entry.verified = true;
  res.json({ success: true, entry });
});

// Courses content proxy - serves the raw Courses.txt from project root
app.get('/api/courses', async (_req, res) => {
  try {
    const filePath = path.resolve(__dirname, '../../Courses.txt');
    const data = await fs.readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(data);
  } catch (e: any) {
    return res.status(404).json({ error: 'Courses.txt not found', details: e?.message });
  }
});

// Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
  const text: string = req.body?.text ?? '';
  const mode: 'thesidia' | 'matrix' = req.body?.mode === 'matrix' ? 'matrix' : 'thesidia';
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  try {
    if (mode === 'matrix') {
      // Proxy to Ollama streaming
      const upstream = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'llama3.1:latest', prompt: text, stream: true, options: { temperature: 0.7 } })
      });
      const stream = (upstream as any).body;
      if (!stream) { res.end(); return; }
      stream.on('data', (chunk: Buffer) => res.write(chunk));
      stream.on('end', () => res.end());
      stream.on('error', () => res.end());
    } else {
      // Thesidia is non-streaming; simulate small chunks
      const r = await fetch('http://127.0.0.1:5055/process', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, context: {} })
      });
      const raw = await r.text();
      let reply = '';
      try {
        const parsed: any = JSON.parse(raw);
        reply = typeof parsed.reply === 'string' ? parsed.reply : '';
      } catch {
        reply = '';
      }
      const size = 64;
      for (let i = 0; i < reply.length; i += size) {
        res.write(reply.slice(i, i + size));
      }
      res.end();
    }
  } catch {
    res.end();
  }
});

// Model Management API Routes
app.get('/api/models/available', (req, res) => consciousnessController.getAvailableModels(req, res));
app.get('/api/models/capabilities', (req, res) => consciousnessController.getModelCapabilities(req, res));
app.post('/api/models/select-optimal', (req, res) => consciousnessController.selectOptimalModel(req, res));

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
  const status = err.status || err.statusCode || 500;
  if (status === 400 || err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
  }
  console.error('❌ SERVER ERROR:', err);
  res.status(status).json({
    success: false,
    error: status === 500 ? 'Internal server error' : err.message,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
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
      'POST /api/astral-entities/classify',
      'GET /api/collective-intelligence/patterns',
      'POST /api/consciousness/broadcast',
      'GET /api/consciousness/recent',
      'GET /api/consciousness/breakthroughs',
      'POST /api/consciousness/nodes',
      'GET /api/consciousness/nodes/search',
      'GET /api/consciousness/health',
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

// Start the server unless running in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Export for testing
export { app, server }; 
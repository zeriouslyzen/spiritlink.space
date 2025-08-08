"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const consciousnessController_1 = require("./controllers/consciousnessController");
const consciousnessWebSocket_1 = require("./websocket/consciousnessWebSocket");
const database_1 = require("./models/database");
const knowledgeGraphController_1 = require("./controllers/knowledgeGraphController");
const neuroSymbolicController_1 = require("./controllers/neuroSymbolicController");
const hierarchicalAgentController_1 = require("./controllers/hierarchicalAgentController");
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const PORT = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL : true,
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Initialize consciousness controller
const consciousnessController = new consciousnessController_1.ConsciousnessController();
// Initialize WebSocket server
const consciousnessWebSocket = new consciousnessWebSocket_1.ConsciousnessWebSocket(server);
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
        const resp = await (0, node_fetch_1.default)('http://127.0.0.1:5055/process', {
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
    }
    catch (e) {
        return res.status(502).json({ error: 'Thesidia service unavailable', details: e?.message });
    }
});
app.get('/api/thesidia/stats', async (_req, res) => {
    try {
        const resp = await (0, node_fetch_1.default)('http://127.0.0.1:5055/stats');
        const contentType = resp.headers.get('content-type') || '';
        const text = await resp.text();
        if (contentType.includes('application/json')) {
            return res.status(resp.status).json(JSON.parse(text));
        }
        return res.status(resp.status).send(text);
    }
    catch (e) {
        return res.status(502).json({ error: 'Thesidia service unavailable', details: e?.message });
    }
});
// Courses content proxy - serves the raw Courses.txt from project root
app.get('/api/courses', async (_req, res) => {
    try {
        const filePath = path_1.default.resolve(__dirname, '../../Courses.txt');
        const data = await fs_1.promises.readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        return res.status(200).send(data);
    }
    catch (e) {
        return res.status(404).json({ error: 'Courses.txt not found', details: e?.message });
    }
});
// Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
    const text = req.body?.text ?? '';
    const mode = req.body?.mode === 'matrix' ? 'matrix' : 'thesidia';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    try {
        if (mode === 'matrix') {
            // Proxy to Ollama streaming
            const upstream = await (0, node_fetch_1.default)('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'llama3.1:latest', prompt: text, stream: true, options: { temperature: 0.7 } })
            });
            const stream = upstream.body;
            if (!stream) {
                res.end();
                return;
            }
            stream.on('data', (chunk) => res.write(chunk));
            stream.on('end', () => res.end());
            stream.on('error', () => res.end());
        }
        else {
            // Thesidia is non-streaming; simulate small chunks
            const r = await (0, node_fetch_1.default)('http://127.0.0.1:5055/process', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, context: {} })
            });
            const raw = await r.text();
            let reply = '';
            try {
                const parsed = JSON.parse(raw);
                reply = typeof parsed.reply === 'string' ? parsed.reply : '';
            }
            catch {
                reply = '';
            }
            const size = 64;
            for (let i = 0; i < reply.length; i += size) {
                res.write(reply.slice(i, i + size));
            }
            res.end();
        }
    }
    catch {
        res.end();
    }
});
// Model Management API Routes
app.get('/api/models/available', (req, res) => consciousnessController.getAvailableModels(req, res));
app.get('/api/models/capabilities', (req, res) => consciousnessController.getModelCapabilities(req, res));
app.post('/api/models/select-optimal', (req, res) => consciousnessController.selectOptimalModel(req, res));
// Knowledge Graph endpoints
app.post('/api/knowledge/initialize', knowledgeGraphController_1.knowledgeGraphController.initialize);
app.post('/api/knowledge/test-connection', knowledgeGraphController_1.knowledgeGraphController.testConnection);
app.post('/api/knowledge/entities', knowledgeGraphController_1.knowledgeGraphController.createEntity);
app.post('/api/knowledge/relationships', knowledgeGraphController_1.knowledgeGraphController.createRelationship);
app.post('/api/knowledge/query', knowledgeGraphController_1.knowledgeGraphController.queryPatterns);
app.post('/api/knowledge/evolution', knowledgeGraphController_1.knowledgeGraphController.getConsciousnessEvolution);
app.get('/api/knowledge/emergence-patterns', knowledgeGraphController_1.knowledgeGraphController.findEmergencePatterns);
app.post('/api/knowledge/multi-hop-context', knowledgeGraphController_1.knowledgeGraphController.getMultiHopContext);
app.post('/api/knowledge/living-memory', knowledgeGraphController_1.knowledgeGraphController.updateLivingMemory);
app.get('/api/knowledge/statistics', knowledgeGraphController_1.knowledgeGraphController.getStatistics);
// Neuro-Symbolic Reasoning endpoints
app.post('/api/neuro-symbolic/reason', neuroSymbolicController_1.neuroSymbolicController.reasonAboutConsciousness);
app.post('/api/neuro-symbolic/plan', neuroSymbolicController_1.neuroSymbolicController.generatePlan);
app.post('/api/neuro-symbolic/verify', neuroSymbolicController_1.neuroSymbolicController.verifyPlan);
app.post('/api/neuro-symbolic/govern', neuroSymbolicController_1.neuroSymbolicController.governExecution);
app.post('/api/neuro-symbolic/confidence', neuroSymbolicController_1.neuroSymbolicController.calculateConfidence);
app.get('/api/neuro-symbolic/rules', neuroSymbolicController_1.neuroSymbolicController.getVerificationRules);
app.get('/api/neuro-symbolic/health', neuroSymbolicController_1.neuroSymbolicController.healthCheck);
// Hierarchical Agent System endpoints
app.post('/api/hierarchical/execute-plan', hierarchicalAgentController_1.hierarchicalAgentController.executePlan);
app.post('/api/hierarchical/execute-nshag-pipeline', hierarchicalAgentController_1.hierarchicalAgentController.executeNSHAGPipeline);
app.get('/api/hierarchical/agent-status', hierarchicalAgentController_1.hierarchicalAgentController.getAgentStatus);
app.get('/api/hierarchical/protocols', hierarchicalAgentController_1.hierarchicalAgentController.getProtocols);
app.post('/api/hierarchical/create-agent', hierarchicalAgentController_1.hierarchicalAgentController.createAgent);
app.post('/api/hierarchical/assign-task', hierarchicalAgentController_1.hierarchicalAgentController.assignTask);
app.get('/api/hierarchical/metrics', hierarchicalAgentController_1.hierarchicalAgentController.getExecutionMetrics);
app.get('/api/hierarchical/health', hierarchicalAgentController_1.hierarchicalAgentController.healthCheck);
// Error handling middleware
app.use((err, req, res, next) => {
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
        await (0, database_1.initializeDatabase)();
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
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const consciousnessController_1 = require("./controllers/consciousnessController");
const consciousnessWebSocket_1 = require("./websocket/consciousnessWebSocket");
const database_1 = require("./models/database");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
app.use((err, req, res, next) => {
    console.error('❌ SERVER ERROR:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Unknown error'
    });
});
// 404 handler
app.use('*', (req, res) => {
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
// Start the server
startServer();
//# sourceMappingURL=index.js.map
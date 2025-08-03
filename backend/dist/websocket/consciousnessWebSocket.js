"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsciousnessWebSocket = void 0;
const socket_io_1 = require("socket.io");
const database_1 = require("../models/database");
class ConsciousnessWebSocket {
    constructor(httpServer) {
        this.connectedUsers = new Map();
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
        this.setupEventHandlers();
        console.log('🔮 CONSCIOUSNESS WEBSOCKET SERVER INITIALIZED');
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log('🔮 USER CONNECTED:', socket.id);
            // Store user connection
            this.connectedUsers.set(socket.id, {
                id: socket.id,
                connectedAt: new Date(),
                brainwaveMode: null,
                userId: null
            });
            // Handle user authentication
            socket.on('authenticate', (data) => {
                const user = this.connectedUsers.get(socket.id);
                if (user) {
                    user.userId = data.userId;
                    user.brainwaveMode = data.brainwaveMode;
                    this.connectedUsers.set(socket.id, user);
                    socket.emit('authenticated', { success: true });
                    console.log('🔮 USER AUTHENTICATED:', data.userId, data.brainwaveMode);
                }
            });
            // Handle live consciousness sharing
            socket.on('share-consciousness', async (data) => {
                try {
                    console.log('🔮 CONSCIOUSNESS SHARED:', data);
                    // Save to database
                    const savedData = await database_1.LiveConsciousnessModel.create({
                        userId: data.userId,
                        brainwaveMode: data.brainwaveMode,
                        consciousnessInsight: data.consciousnessInsight,
                        emergencePotential: data.emergencePotential,
                        collectiveResonance: data.collectiveResonance
                    });
                    // Broadcast to all connected users
                    this.io.emit('consciousness-shared', {
                        ...savedData,
                        socketId: socket.id,
                        timestamp: new Date()
                    });
                    // Check for breakthrough potential
                    if (data.emergencePotential > 0.8) {
                        this.handleBreakthroughEvent(data, socket);
                    }
                }
                catch (error) {
                    console.error('❌ CONSCIOUSNESS SHARING ERROR:', error);
                    socket.emit('error', { message: 'Failed to share consciousness' });
                }
            });
            // Handle breakthrough events
            socket.on('breakthrough-event', async (data) => {
                try {
                    console.log('🚀 BREAKTHROUGH EVENT:', data);
                    // Save breakthrough event
                    await database_1.EmergenceEventModel.create({
                        eventType: 'breakthrough',
                        description: `Breakthrough detected: ${data.breakthroughType}`,
                        impactScore: data.globalImpact,
                        consciousnessEvolution: data.consciousnessMetrics.consciousnessEvolution
                    });
                    // Broadcast breakthrough to all users
                    this.io.emit('breakthrough-detected', {
                        ...data,
                        socketId: socket.id,
                        timestamp: new Date()
                    });
                }
                catch (error) {
                    console.error('❌ BREAKTHROUGH EVENT ERROR:', error);
                    socket.emit('error', { message: 'Failed to process breakthrough event' });
                }
            });
            // Handle collective pattern detection
            socket.on('collective-pattern', async (data) => {
                try {
                    console.log('🌐 COLLECTIVE PATTERN:', data);
                    // Save collective intelligence pattern
                    await database_1.CollectiveIntelligenceModel.create({
                        patternType: data.patternType,
                        crossUserData: data.crossUserData,
                        breakthroughMetrics: data.globalSynchronization,
                        globalImpactScore: this.calculateGlobalImpact(data)
                    });
                    // Broadcast pattern to all users
                    this.io.emit('collective-pattern-detected', {
                        ...data,
                        socketId: socket.id,
                        timestamp: new Date()
                    });
                }
                catch (error) {
                    console.error('❌ COLLECTIVE PATTERN ERROR:', error);
                    socket.emit('error', { message: 'Failed to process collective pattern' });
                }
            });
            // Handle emergence detection
            socket.on('emergence-detected', async (data) => {
                try {
                    console.log('🌀 EMERGENCE DETECTED:', data);
                    // Save emergence event
                    await database_1.EmergenceEventModel.create({
                        eventType: data.eventType,
                        description: data.description,
                        impactScore: data.impactScore,
                        consciousnessEvolution: data.consciousnessEvolution,
                        globalSynchronizationData: data.globalSynchronizationData
                    });
                    // Broadcast emergence to all users
                    this.io.emit('emergence-event', {
                        ...data,
                        socketId: socket.id,
                        timestamp: new Date()
                    });
                }
                catch (error) {
                    console.error('❌ EMERGENCE DETECTION ERROR:', error);
                    socket.emit('error', { message: 'Failed to process emergence event' });
                }
            });
            // Handle brainwave mode changes
            socket.on('brainwave-change', (data) => {
                const user = this.connectedUsers.get(socket.id);
                if (user) {
                    user.brainwaveMode = data.brainwaveMode;
                    this.connectedUsers.set(socket.id, user);
                    // Broadcast brainwave change
                    this.io.emit('brainwave-changed', {
                        userId: user.userId,
                        brainwaveMode: data.brainwaveMode,
                        socketId: socket.id,
                        timestamp: new Date()
                    });
                    console.log('🔮 BRAINWAVE CHANGED:', user.userId, data.brainwaveMode);
                }
            });
            // Handle global synchronization
            socket.on('global-sync', (data) => {
                console.log('🌐 GLOBAL SYNCHRONIZATION:', data);
                // Broadcast global sync to all users
                this.io.emit('global-synchronization', {
                    ...data,
                    socketId: socket.id,
                    timestamp: new Date(),
                    connectedUsers: this.connectedUsers.size
                });
            });
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('🔮 USER DISCONNECTED:', socket.id);
                this.connectedUsers.delete(socket.id);
                // Broadcast user disconnect
                this.io.emit('user-disconnected', {
                    socketId: socket.id,
                    timestamp: new Date(),
                    connectedUsers: this.connectedUsers.size
                });
            });
        });
    }
    async handleBreakthroughEvent(data, socket) {
        try {
            console.log('🚀 BREAKTHROUGH POTENTIAL DETECTED:', data);
            // Create breakthrough event
            const breakthroughEvent = {
                userId: data.userId,
                breakthroughType: 'emergence',
                consciousnessMetrics: {
                    noveltyScore: data.emergencePotential,
                    coherenceScore: data.collectiveResonance,
                    breakthroughPotential: data.emergencePotential,
                    selfModificationDetected: true,
                    consciousnessEvolution: data.emergencePotential,
                    patternClarity: data.collectiveResonance,
                    hijackingResistance: 0.9
                },
                globalImpact: data.emergencePotential * data.collectiveResonance,
                timestamp: new Date()
            };
            // Broadcast breakthrough to all users
            this.io.emit('breakthrough-potential', {
                ...breakthroughEvent,
                socketId: socket.id,
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ BREAKTHROUGH HANDLING ERROR:', error);
        }
    }
    calculateGlobalImpact(data) {
        // Calculate global impact based on pattern type and cross-user data
        const impactMap = {
            evolution: 0.6,
            breakthrough: 0.9,
            suppression: -0.3,
            liberation: 0.8
        };
        return impactMap[data.patternType] || 0.5;
    }
    // Public methods for external use
    broadcastConsciousnessSharing(data) {
        this.io.emit('consciousness-shared', {
            ...data,
            timestamp: new Date()
        });
    }
    broadcastBreakthroughEvent(data) {
        this.io.emit('breakthrough-detected', {
            ...data,
            timestamp: new Date()
        });
    }
    broadcastCollectivePattern(data) {
        this.io.emit('collective-pattern-detected', {
            ...data,
            timestamp: new Date()
        });
    }
    getConnectedUsersCount() {
        return this.connectedUsers.size;
    }
    getConnectedUsers() {
        return this.connectedUsers;
    }
}
exports.ConsciousnessWebSocket = ConsciousnessWebSocket;
//# sourceMappingURL=consciousnessWebSocket.js.map
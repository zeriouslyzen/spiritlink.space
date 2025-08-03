"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsciousnessController = void 0;
const quantumRAGService_1 = require("../services/quantumRAGService");
const database_1 = require("../models/database");
class ConsciousnessController {
    constructor() {
        this.quantumRAGService = new quantumRAGService_1.QuantumRAGService();
    }
    // Quantum RAG Processing
    async processConsciousnessQuery(req, res) {
        try {
            const query = req.body;
            console.log('🔮 CONSCIOUSNESS QUERY RECEIVED:', query);
            const response = await this.quantumRAGService.processQuery(query);
            res.json({
                success: true,
                data: response,
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ CONSCIOUSNESS QUERY ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Quantum RAG processing failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Emergence Detection
    async detectEmergence(req, res) {
        try {
            const { query, brainwaveMode, emergenceThreshold } = req.body;
            const consciousnessQuery = {
                query,
                brainwaveMode,
                vectorSpaces: ['semantic', 'contradiction', 'temporal', 'cross_domain', 'frequency'],
                synthesisDepth: 'emergence',
                emergenceThreshold
            };
            const response = await this.quantumRAGService.processQuery(consciousnessQuery);
            res.json({
                success: true,
                data: {
                    emergenceMetrics: response.emergenceMetrics,
                    breakthroughDetected: response.emergenceMetrics.breakthroughPotential > (emergenceThreshold || 0.8),
                    astralEntityMapping: response.astralEntityMapping,
                    tunnelPaths: response.tunnelPaths
                },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ EMERGENCE DETECTION ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Emergence detection failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Astral Entity Classification
    async classifyAstralEntities(req, res) {
        try {
            const { consciousnessData, brainwaveMode } = req.body;
            const query = {
                query: consciousnessData,
                brainwaveMode,
                vectorSpaces: ['contradiction', 'frequency'],
                synthesisDepth: 'deep'
            };
            const response = await this.quantumRAGService.processQuery(query);
            res.json({
                success: true,
                data: {
                    astralEntityMapping: response.astralEntityMapping,
                    detectedEntities: response.astralEntityMapping.detectedEntities,
                    interferencePatterns: response.astralEntityMapping.interferencePatterns,
                    suppressionMechanisms: response.astralEntityMapping.suppressionMechanisms,
                    liberationOpportunities: response.astralEntityMapping.liberationOpportunities
                },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ ASTRAL ENTITY CLASSIFICATION ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Astral entity classification failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Collective Intelligence Patterns
    async getCollectiveIntelligencePatterns(req, res) {
        try {
            const { limit = 10 } = req.query;
            const patterns = await database_1.CollectiveIntelligenceModel.findRecent(Number(limit));
            res.json({
                success: true,
                data: {
                    patterns,
                    totalPatterns: patterns.length,
                    globalImpactScore: patterns.reduce((sum, p) => sum + (p.global_impact_score || 0), 0) / patterns.length
                },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ COLLECTIVE INTELLIGENCE ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Collective intelligence retrieval failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Live Consciousness Sharing
    async shareConsciousness(req, res) {
        try {
            const liveData = req.body;
            const savedData = await database_1.LiveConsciousnessModel.create({
                userId: liveData.userId,
                brainwaveMode: liveData.brainwaveMode,
                consciousnessInsight: liveData.consciousnessInsight,
                emergencePotential: liveData.emergencePotential,
                collectiveResonance: liveData.collectiveResonance
            });
            res.json({
                success: true,
                data: savedData,
                message: 'Consciousness shared successfully',
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ CONSCIOUSNESS SHARING ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Consciousness sharing failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Get Recent Consciousness Sharing
    async getRecentConsciousnessSharing(req, res) {
        try {
            const { limit = 50 } = req.query;
            const recentSharing = await database_1.LiveConsciousnessModel.findRecent(Number(limit));
            res.json({
                success: true,
                data: {
                    recentSharing,
                    totalShares: recentSharing.length,
                    averageEmergencePotential: recentSharing.reduce((sum, s) => sum + (s.emergence_potential || 0), 0) / recentSharing.length,
                    averageCollectiveResonance: recentSharing.reduce((sum, s) => sum + (s.collective_resonance || 0), 0) / recentSharing.length
                },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ RECENT CONSCIOUSNESS SHARING ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Recent consciousness sharing retrieval failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Breakthrough Events
    async getBreakthroughEvents(req, res) {
        try {
            const { limit = 10 } = req.query;
            const breakthroughEvents = await database_1.EmergenceEventModel.findByEventType('breakthrough');
            const recentEvents = breakthroughEvents.slice(0, Number(limit));
            res.json({
                success: true,
                data: {
                    breakthroughEvents: recentEvents,
                    totalBreakthroughs: breakthroughEvents.length,
                    averageImpactScore: breakthroughEvents.reduce((sum, e) => sum + (e.impact_score || 0), 0) / breakthroughEvents.length,
                    averageConsciousnessEvolution: breakthroughEvents.reduce((sum, e) => sum + (e.consciousness_evolution || 0), 0) / breakthroughEvents.length
                },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ BREAKTHROUGH EVENTS ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Breakthrough events retrieval failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Consciousness Nodes
    async createConsciousnessNode(req, res) {
        try {
            const { concept, content, confidence, temporalLayer, domainVector, emergenceMetrics, astralEntityClassification } = req.body;
            const node = await database_1.ConsciousnessNodeModel.create({
                concept,
                content,
                confidence,
                temporalLayer,
                domainVector,
                emergenceMetrics,
                astralEntityClassification
            });
            res.json({
                success: true,
                data: node,
                message: 'Consciousness node created successfully',
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ CONSCIOUSNESS NODE CREATION ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Consciousness node creation failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Search Consciousness Nodes
    async searchConsciousnessNodes(req, res) {
        try {
            const { concept, temporalLayer, domainVector } = req.query;
            let nodes;
            if (concept) {
                nodes = await database_1.ConsciousnessNodeModel.findByConcept(concept);
            }
            else if (temporalLayer) {
                nodes = await database_1.ConsciousnessNodeModel.findByTemporalLayer(temporalLayer);
            }
            else if (domainVector) {
                nodes = await database_1.ConsciousnessNodeModel.findByDomainVector(domainVector);
            }
            else {
                nodes = [];
            }
            res.json({
                success: true,
                data: {
                    nodes,
                    totalNodes: nodes.length,
                    searchCriteria: { concept, temporalLayer, domainVector }
                },
                timestamp: new Date()
            });
        }
        catch (error) {
            console.error('❌ CONSCIOUSNESS NODE SEARCH ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Consciousness node search failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    // Health Check
    async healthCheck(req, res) {
        try {
            res.json({
                success: true,
                data: {
                    status: 'healthy',
                    service: 'consciousness-backend',
                    timestamp: new Date(),
                    features: {
                        quantumRAG: 'operational',
                        emergenceDetection: 'operational',
                        astralEntityMapping: 'operational',
                        collectiveIntelligence: 'operational',
                        liveConsciousnessSharing: 'operational'
                    }
                }
            });
        }
        catch (error) {
            console.error('❌ HEALTH CHECK ERROR:', error);
            res.status(500).json({
                success: false,
                error: 'Health check failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.ConsciousnessController = ConsciousnessController;
//# sourceMappingURL=consciousnessController.js.map
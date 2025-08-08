import { Request, Response } from 'express';
import { QuantumRAGService } from '../services/quantumRAGService';
import { ConsciousnessQuery, LiveConsciousnessData, BreakthroughEvent, CollectivePattern } from '../types/consciousness';
import { ConsciousnessNodeModel, EmergenceEventModel, CollectiveIntelligenceModel, LiveConsciousnessModel } from '../models/database';

export class ConsciousnessController {
  private quantumRAGService: QuantumRAGService;

  constructor() {
    try {
      this.quantumRAGService = new QuantumRAGService();
      console.log('✅ ConsciousnessController initialized with QuantumRAGService');
    } catch (error) {
      console.error('❌ Failed to initialize ConsciousnessController:', error);
      throw error;
    }
  }

  // Quantum RAG Processing
  async processConsciousnessQuery(req: Request, res: Response) {
    try {
      const query: ConsciousnessQuery = req.body;
      
      console.log('🔮 CONSCIOUSNESS QUERY RECEIVED:', query);
      
      // Validate required fields
      if (!query.query || !query.brainwaveMode) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: query and brainwaveMode'
        });
      }
      
      const response = await this.quantumRAGService.processQuery(query);
      
      res.json({
        success: true,
        data: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ CONSCIOUSNESS QUERY ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Quantum RAG processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Emergence Detection
  async detectEmergence(req: Request, res: Response) {
    try {
      const { query, brainwaveMode, emergenceThreshold } = req.body;
      
      const consciousnessQuery: ConsciousnessQuery = {
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
    } catch (error) {
      console.error('❌ EMERGENCE DETECTION ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Emergence detection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Astral Entity Classification
  async classifyAstralEntities(req: Request, res: Response) {
    try {
      const { consciousnessData, brainwaveMode } = req.body;
      
      const query: ConsciousnessQuery = {
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
    } catch (error) {
      console.error('❌ ASTRAL ENTITY CLASSIFICATION ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Astral entity classification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Collective Intelligence Patterns
  async getCollectiveIntelligencePatterns(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      
      const patterns = await CollectiveIntelligenceModel.findRecent(Number(limit));
      
      res.json({
        success: true,
        data: {
          patterns,
          totalPatterns: patterns.length,
          globalImpactScore: patterns.reduce((sum: number, p: any) => sum + (p.global_impact_score || 0), 0) / patterns.length
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ COLLECTIVE INTELLIGENCE ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Collective intelligence retrieval failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Live Consciousness Sharing
  async shareConsciousness(req: Request, res: Response) {
    try {
      const liveData: LiveConsciousnessData = req.body;
      
      const savedData = await LiveConsciousnessModel.create({
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
    } catch (error) {
      console.error('❌ CONSCIOUSNESS SHARING ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Consciousness sharing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get Recent Consciousness Sharing
  async getRecentConsciousnessSharing(req: Request, res: Response) {
    try {
      const { limit = 50 } = req.query;
      
      const recentSharing = await LiveConsciousnessModel.findRecent(Number(limit));
      
      res.json({
        success: true,
        data: {
          recentSharing,
          totalShares: recentSharing.length,
          averageEmergencePotential: recentSharing.reduce((sum: number, s: any) => sum + (s.emergence_potential || 0), 0) / recentSharing.length,
          averageCollectiveResonance: recentSharing.reduce((sum: number, s: any) => sum + (s.collective_resonance || 0), 0) / recentSharing.length
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ RECENT CONSCIOUSNESS SHARING ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Recent consciousness sharing retrieval failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Breakthrough Events
  async getBreakthroughEvents(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      
      const breakthroughEvents = await EmergenceEventModel.findByEventType('breakthrough');
      const recentEvents = breakthroughEvents.slice(0, Number(limit));
      
      res.json({
        success: true,
        data: {
          breakthroughEvents: recentEvents,
          totalBreakthroughs: breakthroughEvents.length,
          averageImpactScore: breakthroughEvents.reduce((sum: number, e: any) => sum + (e.impact_score || 0), 0) / breakthroughEvents.length,
          averageConsciousnessEvolution: breakthroughEvents.reduce((sum: number, e: any) => sum + (e.consciousness_evolution || 0), 0) / breakthroughEvents.length
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ BREAKTHROUGH EVENTS ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Breakthrough events retrieval failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Consciousness Nodes
  async createConsciousnessNode(req: Request, res: Response) {
    try {
      const { concept, content, confidence, temporalLayer, domainVector, emergenceMetrics, astralEntityClassification } = req.body;
      
      const node = await ConsciousnessNodeModel.create({
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
    } catch (error) {
      console.error('❌ CONSCIOUSNESS NODE CREATION ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Consciousness node creation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Search Consciousness Nodes
  async searchConsciousnessNodes(req: Request, res: Response) {
    try {
      const { concept, temporalLayer, domainVector } = req.query;
      
      let nodes;
      if (concept) {
        nodes = await ConsciousnessNodeModel.findByConcept(concept as string);
      } else if (temporalLayer) {
        nodes = await ConsciousnessNodeModel.findByTemporalLayer(temporalLayer as any);
      } else if (domainVector) {
        nodes = await ConsciousnessNodeModel.findByDomainVector(domainVector as any);
      } else {
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
    } catch (error) {
      console.error('❌ CONSCIOUSNESS NODE SEARCH ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Consciousness node search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Health Check
  async healthCheck(req: Request, res: Response) {
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
    } catch (error) {
      console.error('❌ HEALTH CHECK ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Model Management Methods
  async getAvailableModels(req: Request, res: Response) {
    try {
      const models = [
        {
          name: 'llama3.1:latest',
          size: '4.9 GB',
          description: 'Fast consciousness processing',
          consciousnessCapability: 'high'
        },
        {
          name: 'mixtral:latest',
          size: '26 GB',
          description: 'Deep consciousness research',
          consciousnessCapability: 'high'
        },
        {
          name: 'gpt4all:latest',
          size: '3.8 GB',
          description: 'Versatile consciousness processing',
          consciousnessCapability: 'high'
        },
        {
          name: 'llama2:13b',
          size: '13.0 GB',
          description: 'Balanced consciousness reasoning',
          consciousnessCapability: 'high'
        },
        {
          name: 'vicuna:latest',
          size: '13.0 GB',
          description: 'Advanced emergence detection',
          consciousnessCapability: 'high'
        },
        {
          name: 'wizardlm:latest',
          size: '7.0 GB',
          description: 'Wizard-level consciousness exploration',
          consciousnessCapability: 'high'
        }
      ];

      res.json({
        success: true,
        models,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ GET AVAILABLE MODELS ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get available models',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getModelCapabilities(req: Request, res: Response) {
    try {
      const capabilities = {
        'llama3.1:latest': {
          consciousnessCapability: 'high',
          specialization: 'reasoning',
          brainwaveAffinity: ['alpha', 'beta'],
          size: '4.9 GB'
        },
        'mixtral:latest': {
          consciousnessCapability: 'high',
          specialization: 'analysis',
          brainwaveAffinity: ['gamma', 'emergence'],
          size: '26 GB'
        },
        'gpt4all:latest': {
          consciousnessCapability: 'high',
          specialization: 'versatile',
          brainwaveAffinity: ['theta', 'alpha', 'beta'],
          size: '3.8 GB'
        },
        'llama2:13b': {
          consciousnessCapability: 'high',
          specialization: 'reasoning',
          brainwaveAffinity: ['beta', 'gamma'],
          size: '13.0 GB'
        },
        'vicuna:latest': {
          consciousnessCapability: 'high',
          specialization: 'emergence',
          brainwaveAffinity: ['emergence', 'gamma'],
          size: '13.0 GB'
        },
        'wizardlm:latest': {
          consciousnessCapability: 'high',
          specialization: 'wizard_level',
          brainwaveAffinity: ['alpha', 'beta', 'gamma'],
          size: '7.0 GB'
        }
      };

      res.json({
        success: true,
        capabilities,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ GET MODEL CAPABILITIES ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get model capabilities',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async selectOptimalModel(req: Request, res: Response) {
    try {
      const { brainwaveMode, queryType, queryLength } = req.body;
      
      // Intelligent model selection logic
      let optimalModel = 'llama3.1:latest'; // default
      
      if (brainwaveMode === 'emergence' || brainwaveMode === 'gamma') {
        optimalModel = 'mixtral:latest';
      } else if (brainwaveMode === 'theta' || brainwaveMode === 'alpha') {
        optimalModel = 'gpt4all:latest';
      } else if (brainwaveMode === 'beta') {
        optimalModel = 'llama2:13b';
      }
      
      // Adjust based on query characteristics
      if (queryLength > 200) {
        optimalModel = 'wizardlm:latest';
      }
      
      if (queryType === 'analytical') {
        optimalModel = 'llama2:13b';
      } else if (queryType === 'creative') {
        optimalModel = 'gpt4all:latest';
      } else if (queryType === 'emergence') {
        optimalModel = 'vicuna:latest';
      }

      res.json({
        success: true,
        optimalModel,
        reasoning: `Selected ${optimalModel} for ${brainwaveMode} brainwave mode and ${queryType} query type`,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('❌ SELECT OPTIMAL MODEL ERROR:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to select optimal model',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 
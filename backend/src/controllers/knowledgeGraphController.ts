import { Request, Response } from 'express';
import { knowledgeGraphService, ConsciousnessEntity, TemporalRelationship, KnowledgeGraphQuery } from '../services/knowledgeGraphService';

export class KnowledgeGraphController {
  
  // Initialize knowledge graph connection
  async initialize(req: Request, res: Response): Promise<void> {
    try {
      await knowledgeGraphService.connect();
      res.json({ 
        success: true, 
        message: '✅ Knowledge Graph initialized successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ Knowledge Graph initialization failed:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to initialize knowledge graph' 
      });
    }
  }

  // Create a new consciousness entity
  async createEntity(req: Request, res: Response): Promise<void> {
    try {
      const entity: ConsciousnessEntity = req.body;
      console.log('🔮 Creating entity:', entity);
      
      await knowledgeGraphService.createConsciousnessEntity(entity);
      
      res.json({ 
        success: true, 
        message: `✅ Created consciousness entity: ${entity.id}`,
        entity: entity
      });
    } catch (error) {
      console.error('❌ Failed to create entity:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create consciousness entity',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create a temporal relationship
  async createRelationship(req: Request, res: Response): Promise<void> {
    try {
      const relationship: TemporalRelationship = req.body;
      await knowledgeGraphService.createTemporalRelationship(relationship);
      
      res.json({ 
        success: true, 
        message: `✅ Created temporal relationship: ${relationship.sourceId} -> ${relationship.targetId}`,
        relationship: relationship
      });
    } catch (error) {
      console.error('❌ Failed to create relationship:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create temporal relationship' 
      });
    }
  }

  // Query consciousness patterns
  async queryPatterns(req: Request, res: Response): Promise<void> {
    try {
      const query: KnowledgeGraphQuery = req.body;
      console.log('🔮 Querying patterns with:', query);
      
      const patterns = await knowledgeGraphService.queryConsciousnessPatterns(query);
      
      res.json({ 
        success: true, 
        message: `✅ Found ${patterns.length} consciousness patterns`,
        patterns: patterns,
        query: query
      });
    } catch (error) {
      console.error('❌ Failed to query patterns:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to query consciousness patterns',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get consciousness evolution for a user
  async getConsciousnessEvolution(req: Request, res: Response): Promise<void> {
    try {
      const { userId, startTime, endTime } = req.body;
      const evolution = await knowledgeGraphService.getConsciousnessEvolution(
        userId, 
        { start: new Date(startTime), end: new Date(endTime) }
      );
      
      res.json({ 
        success: true, 
        message: `✅ Retrieved consciousness evolution for user: ${userId}`,
        evolution: evolution,
        timeRange: { start: startTime, end: endTime }
      });
    } catch (error) {
      console.error('❌ Failed to get consciousness evolution:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve consciousness evolution' 
      });
    }
  }

  // Find emergence patterns
  async findEmergencePatterns(req: Request, res: Response): Promise<void> {
    try {
      const patterns = await knowledgeGraphService.findEmergencePatterns();
      
      res.json({ 
        success: true, 
        message: `✅ Found ${patterns.length} emergence patterns`,
        patterns: patterns
      });
    } catch (error) {
      console.error('❌ Failed to find emergence patterns:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to find emergence patterns' 
      });
    }
  }

  // Get multi-hop context for an entity
  async getMultiHopContext(req: Request, res: Response): Promise<void> {
    try {
      const { entityId, maxHops = 3 } = req.body;
      const context = await knowledgeGraphService.getMultiHopContext(entityId, maxHops);
      
      res.json({ 
        success: true, 
        message: `✅ Retrieved multi-hop context for entity: ${entityId}`,
        context: context,
        entityId: entityId,
        maxHops: maxHops
      });
    } catch (error) {
      console.error('❌ Failed to get multi-hop context:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve multi-hop context' 
      });
    }
  }

  // Update living memory with new interaction
  async updateLivingMemory(req: Request, res: Response): Promise<void> {
    try {
      const interaction = req.body;
      await knowledgeGraphService.updateLivingMemory(interaction);
      
      res.json({ 
        success: true, 
        message: '✅ Updated living memory with new interaction',
        interaction: interaction
      });
    } catch (error) {
      console.error('❌ Failed to update living memory:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update living memory' 
      });
    }
  }

  // Get knowledge graph statistics
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      // This would query the knowledge graph for statistics
      // For now, return basic info
      res.json({ 
        success: true, 
        message: '✅ Knowledge Graph Statistics',
        statistics: {
          totalEntities: 'Query from Neo4j',
          totalRelationships: 'Query from Neo4j',
          activeConnections: 'Query from Neo4j',
          lastUpdated: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Failed to get statistics:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve knowledge graph statistics' 
      });
    }
  }

  // Test Neo4j connection
  async testConnection(req: Request, res: Response): Promise<void> {
    try {
      const session = knowledgeGraphService['driver'].session();
      const result = await session.run('RETURN "Hello from Neo4j" as message');
      await session.close();
      
      res.json({ 
        success: true, 
        message: '✅ Neo4j connection test successful',
        data: result.records[0].get('message')
      });
    } catch (error) {
      console.error('❌ Neo4j connection test failed:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Neo4j connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const knowledgeGraphController = new KnowledgeGraphController(); 
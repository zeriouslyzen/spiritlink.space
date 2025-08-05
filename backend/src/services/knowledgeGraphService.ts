import neo4j, { Driver, Session, Transaction } from 'neo4j-driver';

// Types for the Dynamic Knowledge Graph
export interface ConsciousnessEntity {
  id: string;
  type: 'consciousness_state' | 'brainwave_mode' | 'emergence_event' | 'user_interaction' | 'thesidia_response';
  properties: Record<string, any>;
  timestamp: Date;
}

export interface TemporalRelationship {
  sourceId: string;
  targetId: string;
  type: 'evolves_to' | 'influences' | 'triggers' | 'contradicts' | 'synthesizes';
  properties: Record<string, any>;
  timestamp: Date;
}

export interface KnowledgeGraphQuery {
  entityType?: string;
  relationshipType?: string;
  temporalRange?: { start: Date; end: Date };
  limit?: number;
}

export class KnowledgeGraphService {
  private driver: Driver;
  private session: Session | null = null;

  constructor() {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'spiritlink2025') // Updated password
    );
  }

  async connect(): Promise<void> {
    try {
      await this.driver.verifyConnectivity();
      console.log('✅ Connected to Neo4j Knowledge Graph');
    } catch (error) {
      console.error('❌ Failed to connect to Neo4j:', error);
      throw error;
    }
  }

  async createConsciousnessEntity(entity: ConsciousnessEntity): Promise<void> {
    const session = this.driver.session();
    try {
      console.log('🔮 Creating consciousness entity in Neo4j:', entity);
      
      // Ensure timestamp is a Date object
      const timestamp = entity.timestamp instanceof Date ? entity.timestamp : new Date(entity.timestamp);
      
      const result = await session.run(
        `
        CREATE (e:ConsciousnessEntity {
          id: $id,
          type: $type,
          properties: $properties,
          timestamp: datetime($timestamp)
        })
        RETURN e
        `,
        {
          id: entity.id,
          type: entity.type,
          properties: JSON.stringify(entity.properties), // Serialize as JSON string
          timestamp: timestamp.toISOString()
        }
      );
      
      console.log('✅ Neo4j result:', result.records.length, 'records');
      console.log(`✅ Created consciousness entity: ${entity.id}`);
    } catch (error) {
      console.error('❌ Neo4j error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async createTemporalRelationship(relationship: TemporalRelationship): Promise<void> {
    const session = this.driver.session();
    try {
      // Ensure timestamp is a Date object
      const timestamp = relationship.timestamp instanceof Date ? relationship.timestamp : new Date(relationship.timestamp);
      
      await session.run(
        `
        MATCH (source:ConsciousnessEntity {id: $sourceId})
        MATCH (target:ConsciousnessEntity {id: $targetId})
        CREATE (source)-[r:TEMPORAL_RELATIONSHIP {
          type: $type,
          properties: $properties,
          timestamp: datetime($timestamp)
        }]->(target)
        `,
        {
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          type: relationship.type,
          properties: JSON.stringify(relationship.properties), // Serialize as JSON string
          timestamp: timestamp.toISOString()
        }
      );
      console.log(`✅ Created temporal relationship: ${relationship.sourceId} -> ${relationship.targetId}`);
    } finally {
      await session.close();
    }
  }

  async queryConsciousnessPatterns(query: KnowledgeGraphQuery): Promise<any[]> {
    const session = this.driver.session();
    try {
      console.log('🔮 Querying consciousness patterns with:', query);
      
      let cypherQuery = `
        MATCH (e:ConsciousnessEntity)
        WHERE 1=1
      `;
      
      const params: any = {};
      
      if (query.entityType) {
        cypherQuery += ` AND e.type = $entityType`;
        params.entityType = query.entityType;
      }
      
      if (query.temporalRange) {
        cypherQuery += ` AND e.timestamp >= datetime($startTime) AND e.timestamp <= datetime($endTime)`;
        params.startTime = query.temporalRange.start.toISOString();
        params.endTime = query.temporalRange.end.toISOString();
      }
      
      cypherQuery += `
        OPTIONAL MATCH (e)-[r:TEMPORAL_RELATIONSHIP]->(target)
        RETURN e, r, target
        ORDER BY e.timestamp DESC
      `;
      
      if (query.limit) {
        cypherQuery += ` LIMIT $limit`;
        params.limit = query.limit;
      }
      
      console.log('🔮 Cypher query:', cypherQuery);
      console.log('🔮 Query params:', params);
      
      const result = await session.run(cypherQuery, params);
      
      console.log('✅ Query result:', result.records.length, 'records');
      
      return result.records.map(record => {
        const entity = record.get('e');
        const relationship = record.get('r');
        const target = record.get('target');
        
        // Parse JSON properties if they exist
        if (entity && entity.properties) {
          try {
            entity.properties = JSON.parse(entity.properties);
          } catch (e) {
            // Properties might already be parsed
          }
        }
        
        if (relationship && relationship.properties) {
          try {
            relationship.properties = JSON.parse(relationship.properties);
          } catch (e) {
            // Properties might already be parsed
          }
        }
        
        if (target && target.properties) {
          try {
            target.properties = JSON.parse(target.properties);
          } catch (e) {
            // Properties might already be parsed
          }
        }
        
        return {
          entity,
          relationship,
          target
        };
      });
    } catch (error) {
      console.error('❌ Query error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async getConsciousnessEvolution(userId: string, timeRange: { start: Date; end: Date }): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
        MATCH path = (start:ConsciousnessEntity)-[:TEMPORAL_RELATIONSHIP*]->(end:ConsciousnessEntity)
        WHERE start.properties.userId = $userId
        AND start.timestamp >= datetime($startTime)
        AND end.timestamp <= datetime($endTime)
        RETURN path
        ORDER BY start.timestamp
        `,
        {
          userId,
          startTime: timeRange.start.toISOString(),
          endTime: timeRange.end.toISOString()
        }
      );
      
      return result.records.map(record => record.get('path'));
    } finally {
      await session.close();
    }
  }

  async findEmergencePatterns(): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
        MATCH (e:ConsciousnessEntity {type: 'emergence_event'})
        WITH e
        MATCH (e)-[:TEMPORAL_RELATIONSHIP]->(influenced)
        RETURN e, collect(influenced) as influencedEntities
        ORDER BY e.timestamp DESC
        LIMIT 10
        `
      );
      
      return result.records.map(record => ({
        emergenceEvent: record.get('e'),
        influencedEntities: record.get('influencedEntities')
      }));
    } finally {
      await session.close();
    }
  }

  async getMultiHopContext(entityId: string, maxHops: number = 3): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
        MATCH path = (start:ConsciousnessEntity {id: $entityId})-[*1..$maxHops]-(related)
        RETURN path, length(path) as hopCount
        ORDER BY hopCount
        LIMIT 50
        `,
        {
          entityId,
          maxHops
        }
      );
      
      return result.records.map(record => ({
        path: record.get('path'),
        hopCount: record.get('hopCount')
      }));
    } finally {
      await session.close();
    }
  }

  async updateLivingMemory(interaction: any): Promise<void> {
    // Create entity for the interaction
    const interactionEntity: ConsciousnessEntity = {
      id: `interaction_${Date.now()}`,
      type: 'user_interaction',
      properties: {
        userId: interaction.userId,
        message: interaction.message,
        brainwaveMode: interaction.brainwaveMode,
        consciousnessState: interaction.consciousnessState
      },
      timestamp: new Date()
    };

    await this.createConsciousnessEntity(interactionEntity);

    // Create relationships with previous consciousness states
    const previousStates = await this.queryConsciousnessPatterns({
      entityType: 'consciousness_state',
      limit: 5
    });

    for (const state of previousStates) {
      if (state.entity) {
        const relationship: TemporalRelationship = {
          sourceId: state.entity.properties.id,
          targetId: interactionEntity.id,
          type: 'influences',
          properties: {
            influenceStrength: this.calculateInfluenceStrength(state.entity, interactionEntity)
          },
          timestamp: new Date()
        };
        await this.createTemporalRelationship(relationship);
      }
    }
  }

  private calculateInfluenceStrength(previousState: any, currentInteraction: ConsciousnessEntity): number {
    // Simple influence calculation based on consciousness state similarity
    const previousMode = previousState.properties?.brainwaveMode;
    const currentMode = currentInteraction.properties.brainwaveMode;
    
    if (previousMode === currentMode) {
      return 0.8; // High influence if same brainwave mode
    }
    
    return 0.3; // Lower influence if different modes
  }

  async close(): Promise<void> {
    if (this.session) {
      await this.session.close();
    }
    await this.driver.close();
  }
}

// Export singleton instance
export const knowledgeGraphService = new KnowledgeGraphService(); 
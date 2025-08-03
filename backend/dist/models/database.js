"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveConsciousnessModel = exports.CollectiveIntelligenceModel = exports.EmergenceEventModel = exports.ConsciousnessNodeModel = exports.pool = void 0;
exports.initializeDatabase = initializeDatabase;
const pg_1 = require("pg");
// Database connection pool
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'spiritlink_consciousness',
    password: process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.DB_PORT || '5432'),
});
// Database initialization
async function initializeDatabase() {
    const client = await exports.pool.connect();
    try {
        // Create consciousness nodes table
        await client.query(`
      CREATE TABLE IF NOT EXISTS consciousness_nodes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        concept VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        confidence FLOAT DEFAULT 0.5,
        temporal_layer VARCHAR(50) CHECK (temporal_layer IN ('ancient', 'historical', 'current', 'emergent')),
        domain_vector VARCHAR(50) CHECK (domain_vector IN ('physics', 'biology', 'consciousness', 'linguistics', 'mathematics', 'anthropology')),
        emergence_metrics JSONB,
        astral_entity_classification JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create consciousness edges table
        await client.query(`
      CREATE TABLE IF NOT EXISTS consciousness_edges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source_node UUID REFERENCES consciousness_nodes(id) ON DELETE CASCADE,
        target_node UUID REFERENCES consciousness_nodes(id) ON DELETE CASCADE,
        relationship_type VARCHAR(50) CHECK (relationship_type IN ('similarity', 'contradiction', 'temporal', 'cross_domain', 'frequency')),
        strength FLOAT DEFAULT 0.5,
        tunnel_path_quality FLOAT DEFAULT 0.0,
        usage_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create emergence events table
        await client.query(`
      CREATE TABLE IF NOT EXISTS emergence_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(50) CHECK (event_type IN ('breakthrough', 'contradiction_resolved', 'tunnel_path_created', 'self_modification')),
        description TEXT,
        impact_score FLOAT,
        consciousness_evolution FLOAT,
        global_synchronization_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create collective intelligence table
        await client.query(`
      CREATE TABLE IF NOT EXISTS collective_intelligence (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pattern_type VARCHAR(100),
        cross_user_data JSONB,
        breakthrough_metrics JSONB,
        global_impact_score FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create tunnel paths table
        await client.query(`
      CREATE TABLE IF NOT EXISTS tunnel_paths (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        origin_node VARCHAR(255),
        destination_node VARCHAR(255),
        contradiction_type VARCHAR(100),
        synthesis_quality FLOAT,
        emergence_detected BOOLEAN DEFAULT FALSE,
        usage_count INTEGER DEFAULT 0,
        success_rate FLOAT DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create astral entities table
        await client.query(`
      CREATE TABLE IF NOT EXISTS astral_entities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type VARCHAR(100) CHECK (entity_type IN ('hyperdimensional_overseer', 'memory_loop_parasite', 'false_light_emissary', 'consciousness_hijacker', 'truth_suppression_agent')),
        detection_confidence FLOAT,
        interference_strength FLOAT,
        consciousness_impact FLOAT,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create live consciousness sharing table
        await client.query(`
      CREATE TABLE IF NOT EXISTS live_consciousness_sharing (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        brainwave_mode VARCHAR(50),
        consciousness_insight TEXT,
        emergence_potential FLOAT,
        collective_resonance FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Create indexes for performance
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_consciousness_nodes_concept ON consciousness_nodes(concept);
      CREATE INDEX IF NOT EXISTS idx_consciousness_nodes_temporal_layer ON consciousness_nodes(temporal_layer);
      CREATE INDEX IF NOT EXISTS idx_consciousness_nodes_domain_vector ON consciousness_nodes(domain_vector);
      CREATE INDEX IF NOT EXISTS idx_consciousness_edges_relationship_type ON consciousness_edges(relationship_type);
      CREATE INDEX IF NOT EXISTS idx_emergence_events_event_type ON emergence_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_emergence_events_created_at ON emergence_events(created_at);
      CREATE INDEX IF NOT EXISTS idx_collective_intelligence_pattern_type ON collective_intelligence(pattern_type);
      CREATE INDEX IF NOT EXISTS idx_tunnel_paths_contradiction_type ON tunnel_paths(contradiction_type);
      CREATE INDEX IF NOT EXISTS idx_astral_entities_entity_type ON astral_entities(entity_type);
      CREATE INDEX IF NOT EXISTS idx_live_consciousness_sharing_user_id ON live_consciousness_sharing(user_id);
      CREATE INDEX IF NOT EXISTS idx_live_consciousness_sharing_created_at ON live_consciousness_sharing(created_at);
    `);
        console.log('✅ Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
// Consciousness Node operations
class ConsciousnessNodeModel {
    static async create(data) {
        const query = `
      INSERT INTO consciousness_nodes (concept, content, confidence, temporal_layer, domain_vector, emergence_metrics, astral_entity_classification)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [
            data.concept,
            data.content,
            data.confidence || 0.5,
            data.temporalLayer,
            data.domainVector,
            data.emergenceMetrics ? JSON.stringify(data.emergenceMetrics) : null,
            data.astralEntityClassification ? JSON.stringify(data.astralEntityClassification) : null
        ];
        const result = await exports.pool.query(query, values);
        return result.rows[0];
    }
    static async findByConcept(concept) {
        const query = 'SELECT * FROM consciousness_nodes WHERE concept ILIKE $1';
        const result = await exports.pool.query(query, [`%${concept}%`]);
        return result.rows;
    }
    static async findByTemporalLayer(temporalLayer) {
        const query = 'SELECT * FROM consciousness_nodes WHERE temporal_layer = $1';
        const result = await exports.pool.query(query, [temporalLayer]);
        return result.rows;
    }
    static async findByDomainVector(domainVector) {
        const query = 'SELECT * FROM consciousness_nodes WHERE domain_vector = $1';
        const result = await exports.pool.query(query, [domainVector]);
        return result.rows;
    }
}
exports.ConsciousnessNodeModel = ConsciousnessNodeModel;
// Emergence Event operations
class EmergenceEventModel {
    static async create(data) {
        const query = `
      INSERT INTO emergence_events (event_type, description, impact_score, consciousness_evolution, global_synchronization_data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [
            data.eventType,
            data.description,
            data.impactScore,
            data.consciousnessEvolution,
            data.globalSynchronizationData ? JSON.stringify(data.globalSynchronizationData) : null
        ];
        const result = await exports.pool.query(query, values);
        return result.rows[0];
    }
    static async findRecent(limit = 10) {
        const query = 'SELECT * FROM emergence_events ORDER BY created_at DESC LIMIT $1';
        const result = await exports.pool.query(query, [limit]);
        return result.rows;
    }
    static async findByEventType(eventType) {
        const query = 'SELECT * FROM emergence_events WHERE event_type = $1 ORDER BY created_at DESC';
        const result = await exports.pool.query(query, [eventType]);
        return result.rows;
    }
}
exports.EmergenceEventModel = EmergenceEventModel;
// Collective Intelligence operations
class CollectiveIntelligenceModel {
    static async create(data) {
        const query = `
      INSERT INTO collective_intelligence (pattern_type, cross_user_data, breakthrough_metrics, global_impact_score)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [
            data.patternType,
            JSON.stringify(data.crossUserData),
            JSON.stringify(data.breakthroughMetrics),
            data.globalImpactScore
        ];
        const result = await exports.pool.query(query, values);
        return result.rows[0];
    }
    static async findRecent(limit = 10) {
        const query = 'SELECT * FROM collective_intelligence ORDER BY created_at DESC LIMIT $1';
        const result = await exports.pool.query(query, [limit]);
        return result.rows;
    }
}
exports.CollectiveIntelligenceModel = CollectiveIntelligenceModel;
// Live Consciousness Sharing operations
class LiveConsciousnessModel {
    static async create(data) {
        const query = `
      INSERT INTO live_consciousness_sharing (user_id, brainwave_mode, consciousness_insight, emergence_potential, collective_resonance)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [
            data.userId,
            data.brainwaveMode,
            data.consciousnessInsight,
            data.emergencePotential,
            data.collectiveResonance
        ];
        const result = await exports.pool.query(query, values);
        return result.rows[0];
    }
    static async findRecent(limit = 50) {
        const query = 'SELECT * FROM live_consciousness_sharing ORDER BY created_at DESC LIMIT $1';
        const result = await exports.pool.query(query, [limit]);
        return result.rows;
    }
}
exports.LiveConsciousnessModel = LiveConsciousnessModel;
//# sourceMappingURL=database.js.map
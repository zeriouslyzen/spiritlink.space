"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveConsciousnessModel = exports.CollectiveIntelligenceModel = exports.EmergenceEventModel = exports.ConsciousnessNodeModel = exports.PGVECTOR_AVAILABLE = exports.pool = void 0;
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
exports.PGVECTOR_AVAILABLE = false;
async function initializeDatabase() {
    // Allow skipping DB in local dev when Postgres isn't available
    if (process.env.DB_DISABLED === '1') {
        console.log('⚠️ Database disabled via DB_DISABLED=1; skipping initialization');
        return;
    }
    const client = await exports.pool.connect();
    try {
        // Ensure required extensions
        try {
            await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        }
        catch { }
        try {
            await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`);
        }
        catch { }
        try {
            await client.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
        }
        catch { }
        try {
            await client.query(`CREATE EXTENSION IF NOT EXISTS btree_gin;`);
        }
        catch { }
        try {
            const chk = await client.query(`SELECT 1 FROM pg_extension WHERE extname='vector'`);
            exports.PGVECTOR_AVAILABLE = ((chk?.rowCount ?? 0) > 0);
        }
        catch {
            exports.PGVECTOR_AVAILABLE = false;
        }
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
        if (exports.PGVECTOR_AVAILABLE) {
            // Retrieval store: documents
            await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          source TEXT,
          hash TEXT UNIQUE,
          title TEXT,
          mime TEXT,
          owner_id TEXT,
          created_at timestamptz DEFAULT now()
        );
      `);
            // Retrieval store: chunks
            await client.query(`
        CREATE TABLE IF NOT EXISTS chunks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
          text TEXT NOT NULL,
          embedding vector(1024),
          embedding_model TEXT DEFAULT 'bge-m3',
          embedding_dim INT DEFAULT 1024,
          lang TEXT,
          span int4range,
          entities JSONB DEFAULT '[]'::jsonb,
          sparse_tsv tsvector,
          created_at timestamptz DEFAULT now()
        );
      `);
            // Retrieval store: entities and link table
            await client.query(`
        CREATE TABLE IF NOT EXISTS entities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          type TEXT,
          name TEXT,
          kb_id TEXT,
          attrs JSONB DEFAULT '{}'::jsonb
        );
      `);
            await client.query(`
        CREATE TABLE IF NOT EXISTS chunk_entities (
          chunk_id UUID REFERENCES chunks(id) ON DELETE CASCADE,
          entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
          weight REAL DEFAULT 1.0,
          PRIMARY KEY (chunk_id, entity_id)
        );
      `);
            // Audit and artifacts
            await client.query(`
        CREATE TABLE IF NOT EXISTS audits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          task_id TEXT,
          actor TEXT,
          actor_ip INET,
          session_id TEXT,
          action TEXT,
          payload_hash TEXT,
          ts timestamptz DEFAULT now()
        );
      `);
            await client.query(`
        CREATE TABLE IF NOT EXISTS artifacts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          task_id TEXT,
          kind TEXT,
          sha256 TEXT,
          uri TEXT,
          lineage JSONB DEFAULT '[]'::jsonb,
          created_at timestamptz DEFAULT now()
        );
      `);
            // tsvector trigger to keep sparse_tsv updated
            await client.query(`
        CREATE OR REPLACE FUNCTION update_sparse_tsv() RETURNS trigger AS $$
        BEGIN
          NEW.sparse_tsv := to_tsvector('simple', coalesce(NEW.text,''));
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
            await client.query(`DROP TRIGGER IF EXISTS trg_chunks_sparse ON chunks;`);
            await client.query(`
        CREATE TRIGGER trg_chunks_sparse
        BEFORE INSERT OR UPDATE OF text ON chunks
        FOR EACH ROW EXECUTE FUNCTION update_sparse_tsv();
      `);
        }
        else {
            console.warn('⚠️ pgvector extension not available. Skipping retrieval DDL. Set up pgvector and restart.');
        }
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
        // Memory entries (per-user/session)
        await client.query(`
      CREATE TABLE IF NOT EXISTS memory_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        mode VARCHAR(50),
        prompt TEXT,
        model VARCHAR(255),
        response TEXT,
        candidates JSONB,
        governance_notes JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // User skills registry
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        name VARCHAR(255),
        trigger JSONB,
        constraints JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Skill traces
        await client.query(`
      CREATE TABLE IF NOT EXISTS skill_traces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        skill_name VARCHAR(255),
        input JSONB,
        output JSONB,
        confidence FLOAT,
        evidence JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
        // Contradictions harvested
        await client.query(`
      CREATE TABLE IF NOT EXISTS contradictions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        a TEXT,
        b TEXT,
        resolved BOOLEAN DEFAULT FALSE,
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
      CREATE INDEX IF NOT EXISTS idx_memory_entries_user_session ON memory_entries(user_id, session_id);
      CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);
      CREATE INDEX IF NOT EXISTS idx_skill_traces_user_session ON skill_traces(user_id, session_id);
      CREATE INDEX IF NOT EXISTS idx_contradictions_user_session ON contradictions(user_id, session_id);
      ${exports.PGVECTOR_AVAILABLE ? "CREATE INDEX IF NOT EXISTS idx_chunks_sparse_gin ON chunks USING GIN (sparse_tsv);" : ''}
      ${exports.PGVECTOR_AVAILABLE ? "CREATE INDEX IF NOT EXISTS idx_chunks_lang ON chunks(lang);" : ''}
      ${exports.PGVECTOR_AVAILABLE ? "CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);" : ''}
    `);
        if (exports.PGVECTOR_AVAILABLE) {
            // HNSW index with IVFFLAT fallback
            try {
                await client.query(`
          CREATE INDEX IF NOT EXISTS idx_chunks_embedding_hnsw
          ON chunks USING hnsw (embedding vector_l2_ops);
        `);
            }
            catch (e) {
                try {
                    await client.query(`
            CREATE INDEX IF NOT EXISTS idx_chunks_embedding_ivfflat
            ON chunks USING ivfflat (embedding vector_l2_ops) WITH (lists = 200);
          `);
                }
                catch { }
            }
        }
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
import { Pool } from 'pg';
import { TemporalLayer, DomainVector, EmergenceEventType } from '../types/consciousness';
export declare const pool: Pool;
export declare function initializeDatabase(): Promise<void>;
export declare class ConsciousnessNodeModel {
    static create(data: {
        concept: string;
        content: string;
        confidence?: number;
        temporalLayer?: TemporalLayer;
        domainVector?: DomainVector;
        emergenceMetrics?: any;
        astralEntityClassification?: any;
    }): Promise<any>;
    static findByConcept(concept: string): Promise<any[]>;
    static findByTemporalLayer(temporalLayer: TemporalLayer): Promise<any[]>;
    static findByDomainVector(domainVector: DomainVector): Promise<any[]>;
}
export declare class EmergenceEventModel {
    static create(data: {
        eventType: EmergenceEventType;
        description: string;
        impactScore: number;
        consciousnessEvolution: number;
        globalSynchronizationData?: any;
    }): Promise<any>;
    static findRecent(limit?: number): Promise<any[]>;
    static findByEventType(eventType: EmergenceEventType): Promise<any[]>;
}
export declare class CollectiveIntelligenceModel {
    static create(data: {
        patternType: string;
        crossUserData: any;
        breakthroughMetrics: any;
        globalImpactScore: number;
    }): Promise<any>;
    static findRecent(limit?: number): Promise<any[]>;
}
export declare class LiveConsciousnessModel {
    static create(data: {
        userId: string;
        brainwaveMode: string;
        consciousnessInsight: string;
        emergencePotential: number;
        collectiveResonance: number;
    }): Promise<any>;
    static findRecent(limit?: number): Promise<any[]>;
}
//# sourceMappingURL=database.d.ts.map
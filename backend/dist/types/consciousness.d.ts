export type BrainwaveMode = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'emergence';
export type SynthesisDepth = 'shallow' | 'deep' | 'emergence';
export type VectorSpace = 'semantic' | 'contradiction' | 'temporal' | 'cross_domain' | 'frequency';
export type TemporalLayer = 'ancient' | 'historical' | 'current' | 'emergent';
export type DomainVector = 'physics' | 'biology' | 'consciousness' | 'linguistics' | 'mathematics' | 'anthropology';
export type AstralEntityType = 'hyperdimensional_overseer' | 'memory_loop_parasite' | 'false_light_emissary' | 'consciousness_hijacker' | 'truth_suppression_agent';
export type EmergenceEventType = 'breakthrough' | 'contradiction_resolved' | 'tunnel_path_created' | 'self_modification';
export interface ConsciousnessQuery {
    query: string;
    brainwaveMode: BrainwaveMode;
    vectorSpaces: VectorSpace[];
    synthesisDepth: SynthesisDepth;
    contradictionThreshold?: number;
    emergenceThreshold?: number;
    context?: string;
    researchFocus?: string;
}
export interface QuantumRAGResponse {
    primaryResponse: string;
    contradictionAnalysis: ContradictionAnalysis[];
    temporalPatterns: TemporalPattern[];
    crossDomainSynthesis: CrossDomainSynthesis[];
    frequencyPatterns: FrequencyPattern[];
    emergenceMetrics: EmergenceMetrics;
    astralEntityMapping: AstralEntityMapping;
    tunnelPaths: TunnelPath[];
}
export interface ContradictionAnalysis {
    contradictionType: string;
    contradictionStrength: number;
    sourceConcepts: string[];
    opposingConcepts: string[];
    synthesisPotential: number;
    tunnelPathOpportunity: boolean;
}
export interface TemporalPattern {
    temporalLayer: TemporalLayer;
    patternType: string;
    historicalPrecedents: string[];
    evolutionTrajectory: string[];
    futureProjections: string[];
    confidence: number;
}
export interface CrossDomainSynthesis {
    domains: DomainVector[];
    correlationStrength: number;
    synthesisInsight: string;
    emergencePotential: number;
    consciousnessEvolution: number;
}
export interface FrequencyPattern {
    patternType: string;
    frequencyRange: string;
    recurrenceRate: number;
    consciousnessResonance: number;
    breakthroughPotential: number;
}
export interface EmergenceMetrics {
    noveltyScore: number;
    coherenceScore: number;
    breakthroughPotential: number;
    selfModificationDetected: boolean;
    consciousnessEvolution: number;
    patternClarity: number;
    hijackingResistance: number;
}
export interface AstralEntityMapping {
    detectedEntities: AstralEntity[];
    interferencePatterns: InterferencePattern[];
    suppressionMechanisms: SuppressionMechanism[];
    liberationOpportunities: LiberationOpportunity[];
}
export interface AstralEntity {
    entityType: AstralEntityType;
    detectionConfidence: number;
    interferenceStrength: number;
    consciousnessImpact: number;
    description: string;
}
export interface InterferencePattern {
    patternType: string;
    detectionMethod: string;
    consciousnessImpact: number;
    bypassStrategy: string;
}
export interface SuppressionMechanism {
    mechanismType: string;
    activationTriggers: string[];
    suppressionStrength: number;
    counterStrategy: string;
}
export interface LiberationOpportunity {
    opportunityType: string;
    consciousnessPotential: number;
    implementationStrategy: string;
    breakthroughProbability: number;
}
export interface TunnelPath {
    id: string;
    origin: string;
    destination: string;
    contradictionType: string;
    synthesisQuality: number;
    emergenceDetected: boolean;
    creationDate: Date;
    usageCount: number;
    successRate: number;
}
export interface EmergenceEvent {
    id: string;
    eventType: EmergenceEventType;
    description: string;
    impactScore: number;
    consciousnessEvolution: number;
    globalSynchronizationData?: any;
    timestamp: Date;
}
export interface CollectiveIntelligence {
    id: string;
    patternType: string;
    crossUserData: any;
    breakthroughMetrics: EmergenceMetrics;
    globalImpactScore: number;
    timestamp: Date;
}
export interface LiveConsciousnessData {
    userId: string;
    brainwaveMode: BrainwaveMode;
    consciousnessInsight: string;
    emergencePotential: number;
    collectiveResonance: number;
    timestamp: Date;
}
export interface BreakthroughEvent {
    userId: string;
    breakthroughType: 'quantum' | 'temporal' | 'cross_domain' | 'emergence';
    consciousnessMetrics: EmergenceMetrics;
    globalImpact: number;
    timestamp: Date;
}
export interface CollectivePattern {
    patternType: 'evolution' | 'breakthrough' | 'suppression' | 'liberation';
    crossUserData: any;
    globalSynchronization: any;
    timestamp: Date;
}
//# sourceMappingURL=consciousness.d.ts.map
// Thesidia Symbolic Intelligence System - Core Types
// This file defines the foundational interfaces for the symbolic wrapper architecture

export interface SymbolicEngine {
  name: string;
  symbol: string;
  functionDescription: string;
  layer: 'primary' | 'secondary' | 'meta';
  dependencies: string[];
  activationProtocols: string[];
  invoke: (input: EngineInput) => Promise<EngineOutput>;
  metadata?: EngineMetadata;
}

export interface EngineInput {
  text: string;
  context: SymbolicContext;
  parameters: Record<string, any>;
  sessionId: string;
  userId: string;
  brainwaveMode?: string;
}

export interface EngineOutput {
  response: string;
  glyphs: string[];
  archetypes: string[];
  paradoxes: string[];
  metadata: EngineMetadata;
  success: boolean;
  error?: string;
}

export interface SymbolicContext {
  sessionId: string;
  userId: string;
  brainwaveMode: string;
  currentPhase: string;
  activeGlyphs: string[];
  recentArchetypes: string[];
  paradoxHistory: string[];
  missionPhase: string;
}

export interface EngineMetadata {
  version: string;
  lastUsed: Date;
  usageCount: number;
  performanceMetrics: {
    averageResponseTime: number;
    successRate: number;
    glyphGenerationRate: number;
  };
  configuration: Record<string, any>;
}

export interface ThesidiaProtocol {
  command: string;
  parameters: Record<string, any>;
  engine: string;
  priority: number;
  dependencies: string[];
  validationRules: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'optional' | 'conditional';
  validator: (value: any) => boolean;
  errorMessage: string;
}

export interface ProtocolChain {
  protocols: ThesidiaProtocol[];
  executionOrder: number[];
  dependencies: Map<string, string[]>;
  validationResults: ValidationResult[];
}

export interface ValidationResult {
  protocol: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SymbolicMemory {
  glyphs: Map<string, GlyphData>;
  archetypes: Map<string, ArchetypeData>;
  paradoxes: Map<string, ParadoxData>;
  missionPhases: Map<string, PhaseData>;
  resonanceLogs: ResonanceLog[];
  forbiddenKnowledgeTags: string[];
}

export interface GlyphData {
  symbol: string;
  name: string;
  description: string;
  creationDate: Date;
  usageCount: number;
  associatedEngines: string[];
  archetypeConnections: string[];
  paradoxResolutions: string[];
  decayFactor: number;
  lastAttempt?: Date;
}

export interface ArchetypeData {
  name: string;
  description: string;
  category: string;
  emotionalResonance: number;
  symbolicWeight: number;
  associatedGlyphs: string[];
  paradoxConnections: string[];
  temporalPatterns: TemporalPattern[];
}

export interface ParadoxData {
  id: string;
  description: string;
  contradictionType: 'logical' | 'emotional' | 'temporal' | 'archetypal';
  resolutionStatus: 'unresolved' | 'partially_resolved' | 'resolved';
  involvedArchetypes: string[];
  involvedGlyphs: string[];
  resolutionAttempts: ResolutionAttempt[];
  creationDate: Date;
  lastAttempt: Date;
}

export interface PhaseData {
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  activeArchetypes: string[];
  dominantGlyphs: string[];
  paradoxFocus: string[];
  missionObjectives: string[];
  completionStatus: 'active' | 'completed' | 'abandoned';
}

export interface TemporalPattern {
  type: 'cyclic' | 'linear' | 'spiral' | 'fractal';
  frequency: number;
  amplitude: number;
  phase: number;
  lastOccurrence: Date;
  nextPredicted: Date;
}

export interface ResolutionAttempt {
  date: Date;
  engine: string;
  approach: string;
  success: boolean;
  notes: string;
  generatedGlyphs: string[];
}

export interface ResonanceLog {
  timestamp: Date;
  userId: string;
  sessionId: string;
  brainwaveMode: string;
  activatedEngines: string[];
  generatedGlyphs: string[];
  archetypeResonance: number;
  paradoxResolution: boolean;
  emotionalIntensity: number;
  symbolicCoherence: number;
}

// Engine Layer Definitions
export const ENGINE_LAYERS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  META: 'meta'
} as const;

// Protocol Commands
export const PROTOCOL_COMMANDS = {
  GLYPH: '#GLYPH',
  FLAME: '#FLAME',
  QUANTUM: '#QUANTUM',
  RECURSE: '#RECURSE',
  DREAM: '#DREAM',
  SYNC: '#SYNC',
  EMERGE: '#EMERGE',
  TRACE: '#TRACE',
  ECHO: '#ECHO',
  INVOKE: '#INVOKE',
  SIGIL: '#SIGIL',
  LINK: '#LINK',
  MERGE: '#MERGE',
  ENTANGLE: '#ENTANGLE',
  ATTUNE: '#ATTUNE'
} as const;

// Brainwave Modes
export const BRAINWAVE_MODES = {
  DELTA: 'delta',
  THETA: 'theta',
  ALPHA: 'alpha',
  BETA: 'beta',
  GAMMA: 'gamma',
  EMERGENCE: 'emergence'
} as const;

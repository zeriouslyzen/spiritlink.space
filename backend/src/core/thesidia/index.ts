// Thesidia Symbolic Intelligence System - Main Export
// This file provides the main entry point for the symbolic wrapper architecture

// Core types and interfaces
export * from './types';

// Engine registry and management
export * from './engineRegistry';

// Protocol parsing and validation
export { ProtocolParser } from './protocolParser';

// Main orchestrator
export { ThesidiaOrchestrator } from './orchestrator';

// Utility functions
export { 
  getEngineByName, 
  getEngineBySymbol, 
  getEngineByProtocol,
  getEnginesByLayer,
  getEngineDependencies,
  validateEngineDependencies 
} from './engineRegistry';

// Constants
export { 
  ENGINE_LAYERS, 
  PROTOCOL_COMMANDS, 
  BRAINWAVE_MODES 
} from './types';

// Default export for easy importing
export { ThesidiaOrchestrator as default } from './orchestrator';

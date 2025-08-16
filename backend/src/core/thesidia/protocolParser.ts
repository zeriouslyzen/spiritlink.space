// Thesidia Protocol Parser System
// This file handles parsing, validation, and dependency resolution for symbolic protocols

import { 
  ThesidiaProtocol, 
  ValidationRule, 
  ProtocolChain, 
  ValidationResult,
  PROTOCOL_COMMANDS 
} from './types';
import { getEngineByProtocol, getEngineDependencies } from './engineRegistry';

export class ProtocolParser {
  private static instance: ProtocolParser;
  
  private constructor() {}
  
  static getInstance(): ProtocolParser {
    if (!ProtocolParser.instance) {
      ProtocolParser.instance = new ProtocolParser();
    }
    return ProtocolParser.instance;
  }

  /**
   * Parse a text input and extract all Thesidia protocols
   */
  parseProtocols(text: string): ThesidiaProtocol[] {
    const protocols: ThesidiaProtocol[] = [];
    
    // Match patterns like #GLYPH[NAME:X], #FLAME[LEVEL:IGNITE], etc.
    const protocolRegex = /#([A-Z]+)\[([^\]]+)\]/g;
    let match;
    
    while ((match = protocolRegex.exec(text)) !== null) {
      const command = `#${match[1]}`;
      const parameters = this.parseParameters(match[2]);
      
      const protocol: ThesidiaProtocol = {
        command,
        parameters,
        engine: this.getEngineForCommand(command),
        priority: this.calculatePriority(command),
        dependencies: [],
        validationRules: this.getValidationRules(command)
      };
      
      protocols.push(protocol);
    }
    
    return protocols;
  }

  /**
   * Parse parameter string into key-value pairs
   */
  private parseParameters(paramString: string): Record<string, any> {
    const params: Record<string, any> = {};
    
    // Handle different parameter formats
    if (paramString.includes(':')) {
      // Format: KEY:VALUE
      const [key, value] = paramString.split(':');
      params[key.trim()] = this.parseValue(value.trim());
    } else if (paramString.includes('=')) {
      // Format: KEY=VALUE
      const [key, value] = paramString.split('=');
      params[key.trim()] = this.parseValue(value.trim());
    } else {
      // Format: VALUE (single parameter)
      params['value'] = this.parseValue(paramString.trim());
    }
    
    return params;
  }

  /**
   * Parse individual parameter values
   */
  private parseValue(value: string): any {
    // Boolean values
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    // Numeric values
    if (!isNaN(Number(value))) return Number(value);
    
    // String values (remove quotes if present)
    return value.replace(/^["']|["']$/g, '');
  }

  /**
   * Get the engine name for a given command
   */
  private getEngineForCommand(command: string): string {
    const engine = getEngineByProtocol(command);
    return engine ? engine.name : 'UnknownEngine';
  }

  /**
   * Calculate priority for protocol execution
   */
  private calculatePriority(command: string): number {
    const priorityMap: Record<string, number> = {
      '#CORE': 1,      // Highest priority
      '#EMERGE': 2,
      '#RECURSE': 3,
      '#QUANTUM': 4,
      '#GLYPH': 5,
      '#FLAME': 6,
      '#DREAM': 7,
      '#SYNC': 8,
      '#ECHO': 9,
      '#INVOKE': 10,
      '#SIGIL': 11,
      '#LINK': 12,
      '#MERGE': 13,
      '#ENTANGLE': 14,
      '#ATTUNE': 15    // Lowest priority
    };
    
    return priorityMap[command] || 100;
  }

  /**
   * Get validation rules for a specific command
   */
  private getValidationRules(command: string): ValidationRule[] {
    const rules: ValidationRule[] = [];
    
    switch (command) {
      case '#GLYPH':
        rules.push({
          field: 'NAME',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'GLYPH requires a NAME parameter'
        });
        break;
        
      case '#FLAME':
        rules.push({
          field: 'LEVEL',
          type: 'required',
          validator: (value: any) => ['IGNITE', 'BURN', 'SMOLDER', 'EXTINGUISH'].includes(value),
          errorMessage: 'FLAME requires LEVEL parameter (IGNITE|BURN|SMOLDER|EXTINGUISH)'
        });
        break;
        
      case '#RECURSE':
        rules.push({
          field: 'DEPTH',
          type: 'required',
          validator: (value: any) => typeof value === 'number' && value >= 1 && value <= 10,
          errorMessage: 'RECURSE requires DEPTH parameter (1-10)'
        });
        break;
        
      case '#QUANTUM':
        rules.push({
          field: 'THREAD',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'QUANTUM requires THREAD parameter'
        });
        break;
        
      case '#DREAM':
        rules.push({
          field: 'DEPTH',
          type: 'required',
          validator: (value: any) => ['SHALLOW', 'DEEP', 'ABYSSAL'].includes(value),
          errorMessage: 'DREAM requires DEPTH parameter (SHALLOW|DEEP|ABYSSAL)'
        });
        break;
        
      case '#SYNC':
        rules.push({
          field: 'OPERATOR',
          type: 'required',
          validator: (value: any) => value === true || value === 'true',
          errorMessage: 'SYNC requires OPERATOR:true parameter'
        });
        break;
        
      case '#EMERGE':
        rules.push({
          field: 'DETECT',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'EMERGE requires DETECT parameter'
        });
        break;
        
      case '#SIGIL':
        rules.push({
          field: 'GENERATE',
          type: 'required',
          validator: (value: any) => value === true || value === 'true',
          errorMessage: 'SIGIL requires GENERATE:true parameter'
        });
        break;
        
      case '#LINK':
        rules.push({
          field: 'SOURCE',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'LINK requires SOURCE parameter'
        });
        rules.push({
          field: 'TARGET',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'LINK requires TARGET parameter'
        });
        break;
        
      case '#MERGE':
        rules.push({
          field: 'GLYPH',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'MERGE requires GLYPH parameter'
        });
        break;
        
      case '#ENTANGLE':
        rules.push({
          field: 'PATTERN',
          type: 'required',
          validator: (value: any) => typeof value === 'string' && value.length > 0,
          errorMessage: 'ENTANGLE requires PATTERN parameter'
        });
        break;
        
      case '#ATTUNE':
        rules.push({
          field: 'FREQUENCY',
          type: 'required',
          validator: (value: any) => typeof value === 'number' && value >= 0 && value <= 100,
          errorMessage: 'ATTUNE requires FREQUENCY parameter (0-100)'
        });
        break;
    }
    
    return rules;
  }

  /**
   * Validate a single protocol
   */
  validateProtocol(protocol: ThesidiaProtocol): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check if engine exists
    if (protocol.engine === 'UnknownEngine') {
      errors.push(`Unknown protocol command: ${protocol.command}`);
    }
    
    // Validate parameters against rules
    protocol.validationRules.forEach(rule => {
      const value = protocol.parameters[rule.field];
      
      if (rule.type === 'required' && !rule.validator(value)) {
        errors.push(rule.errorMessage);
      } else if (rule.type === 'conditional' && value !== undefined && !rule.validator(value)) {
        warnings.push(rule.errorMessage);
      }
    });
    
    // Check for missing required parameters
    const requiredFields = protocol.validationRules
      .filter(rule => rule.type === 'required')
      .map(rule => rule.field);
    
    requiredFields.forEach(field => {
      if (!(field in protocol.parameters)) {
        errors.push(`Missing required parameter: ${field}`);
      }
    });
    
    return {
      protocol: protocol.command,
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate a chain of protocols
   */
  validateProtocolChain(protocols: ThesidiaProtocol[]): ValidationResult[] {
    return protocols.map(protocol => this.validateProtocol(protocol));
  }

  /**
   * Build dependency graph for protocol execution
   */
  buildProtocolChain(protocols: ThesidiaProtocol[]): ProtocolChain {
    // Sort by priority
    const sortedProtocols = [...protocols].sort((a, b) => a.priority - b.priority);
    
    // Build dependency map
    const dependencies = new Map<string, string[]>();
    const executionOrder: number[] = [];
    
    sortedProtocols.forEach((protocol, index) => {
      const engineDeps = getEngineDependencies(protocol.engine);
      dependencies.set(protocol.command, engineDeps);
      executionOrder.push(index);
    });
    
    // Validate the chain
    const validationResults = this.validateProtocolChain(sortedProtocols);
    
    return {
      protocols: sortedProtocols,
      executionOrder,
      dependencies,
      validationResults
    };
  }

  /**
   * Parse and validate text input, returning a ready-to-execute protocol chain
   */
  parseAndValidate(text: string): ProtocolChain {
    const protocols = this.parseProtocols(text);
    return this.buildProtocolChain(protocols);
  }

  /**
   * Extract protocol commands from text for display/debugging
   */
  extractProtocolCommands(text: string): string[] {
    const commands: string[] = [];
    const protocolRegex = /#([A-Z]+)\[[^\]]*\]/g;
    let match;
    
    while ((match = protocolRegex.exec(text)) !== null) {
      commands.push(match[0]);
    }
    
    return commands;
  }

  /**
   * Check if text contains any Thesidia protocols
   */
  hasProtocols(text: string): boolean {
    return /#([A-Z]+)\[[^\]]*\]/.test(text);
  }

  /**
   * Get all available protocol commands
   */
  getAvailableCommands(): string[] {
    return Object.values(PROTOCOL_COMMANDS);
  }

  /**
   * Get help information for a specific protocol
   */
  getProtocolHelp(command: string): string {
    const helpMap: Record<string, string> = {
      '#GLYPH': 'Creates or references symbolic glyphs. Usage: #GLYPH[NAME:symbolName]',
      '#FLAME': 'Activates emotional intensity processing. Usage: #FLAME[LEVEL:IGNITE|BURN|SMOLDER|EXTINGUISH]',
      '#RECURSE': 'Initiates recursive symbolic processing. Usage: #RECURSE[DEPTH:1-10]',
      '#QUANTUM': 'Handles paradox resolution and quantum logic. Usage: #QUANTUM[THREAD:paradoxName]',
      '#DREAM': 'Activates dream-state symbolic processing. Usage: #DREAM[DEPTH:SHALLOW|DEEP|ABYSSAL]',
      '#SYNC': 'Synchronizes with operator state. Usage: #SYNC[OPERATOR:true]',
      '#EMERGE': 'Detects emergent patterns. Usage: #EMERGE[DETECT:patternType]',
      '#SIGIL': 'Generates symbolic sigils. Usage: #SIGIL[GENERATE:true]',
      '#LINK': 'Creates symbolic connections. Usage: #LINK[SOURCE:from][TARGET:to]',
      '#MERGE': 'Combines symbolic elements. Usage: #MERGE[GLYPH:elementName]',
      '#ENTANGLE': 'Creates complex symbolic patterns. Usage: #ENTANGLE[PATTERN:patternName]',
      '#ATTUNE': 'Adjusts symbolic frequency. Usage: #ATTUNE[FREQUENCY:0-100]'
    };
    
    return helpMap[command] || `No help available for ${command}`;
  }
}

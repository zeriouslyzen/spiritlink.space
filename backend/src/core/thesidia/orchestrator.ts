// Thesidia Engine Orchestrator
// This file coordinates all symbolic engines and manages the overall processing flow

import { 
  SymbolicEngine, 
  EngineInput, 
  EngineOutput, 
  SymbolicContext,
  ProtocolChain,
  ValidationResult,
  BRAINWAVE_MODES
} from './types';
import { 
  SYMBOLIC_ENGINES, 
  getEngineByName, 
  getEnginesByLayer,
  validateEngineDependencies 
} from './engineRegistry';
import { ProtocolParser } from './protocolParser';

export class ThesidiaOrchestrator {
  private static instance: ThesidiaOrchestrator;
  private protocolParser: ProtocolParser;
  private engineStates: Map<string, any> = new Map();
  private recursionDepth: Map<string, number> = new Map();
  private maxRecursionDepth = 10;
  
  private constructor() {
    this.protocolParser = ProtocolParser.getInstance();
    this.initializeEngineStates();
  }
  
  static getInstance(): ThesidiaOrchestrator {
    if (!ThesidiaOrchestrator.instance) {
      ThesidiaOrchestrator.instance = new ThesidiaOrchestrator();
    }
    return ThesidiaOrchestrator.instance;
  }

  /**
   * Initialize engine states and validate dependencies
   */
  private initializeEngineStates(): void {
    // Validate engine dependencies
    const validation = validateEngineDependencies();
    if (!validation.valid) {
      console.error('Engine dependency validation failed:', validation.errors);
      throw new Error('Engine dependency validation failed');
    }

    // Initialize state for each engine
    SYMBOLIC_ENGINES.forEach(engine => {
      this.engineStates.set(engine.name, {
        isActive: false,
        lastUsed: null,
        usageCount: 0,
        performanceMetrics: {
          averageResponseTime: 0,
          successRate: 0,
          glyphGenerationRate: 0
        },
        currentContext: null
      });
    });

    console.log(`✅ Initialized ${SYMBOLIC_ENGINES.length} symbolic engines`);
  }

  /**
   * Main entry point for processing input through the symbolic wrapper
   */
  async processInput(
    text: string,
    sessionId: string,
    userId: string,
    brainwaveMode: string = BRAINWAVE_MODES.ALPHA
  ): Promise<EngineOutput> {
    try {
      // Check if input contains protocols
      if (!this.protocolParser.hasProtocols(text)) {
        // No protocols found, use default processing
        return await this.processDefault(text, sessionId, userId, brainwaveMode);
      }

      // Parse and validate protocols
      const protocolChain = this.protocolParser.parseAndValidate(text);
      
      // Check validation results
      const invalidProtocols = protocolChain.validationResults.filter(r => !r.isValid);
      if (invalidProtocols.length > 0) {
        return {
          response: `Protocol validation failed: ${invalidProtocols.map(p => p.errors.join(', ')).join('; ')}`,
          glyphs: [],
          archetypes: [],
          paradoxes: [],
          metadata: this.createDefaultMetadata(),
          success: false,
          error: 'Protocol validation failed'
        };
      }

      // Process protocols
      return await this.processProtocols(protocolChain, text, sessionId, userId, brainwaveMode);
      
    } catch (error) {
      console.error('Error in ThesidiaOrchestrator.processInput:', error);
      return {
        response: 'Symbolic processing error occurred',
        glyphs: [],
        archetypes: [],
        paradoxes: [],
        metadata: this.createDefaultMetadata(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Process input when no protocols are specified
   */
  private async processDefault(
    text: string,
    sessionId: string,
    userId: string,
    brainwaveMode: string
  ): Promise<EngineOutput> {
    // Create symbolic context
    const context: SymbolicContext = {
      sessionId,
      userId,
      brainwaveMode,
      currentPhase: 'default',
      activeGlyphs: [],
      recentArchetypes: [],
      paradoxHistory: [],
      missionPhase: 'exploration'
    };

    // Use appropriate engine based on brainwave mode
    const engine = this.selectEngineForBrainwaveMode(brainwaveMode);
    
    const input: EngineInput = {
      text,
      context,
      parameters: {},
      sessionId,
      userId,
      brainwaveMode
    };

    return await engine.invoke(input);
  }

  /**
   * Process a chain of protocols
   */
  private async processProtocols(
    protocolChain: ProtocolChain,
    originalText: string,
    sessionId: string,
    userId: string,
    brainwaveMode: string
  ): Promise<EngineOutput> {
    // Create symbolic context
    const context: SymbolicContext = {
      sessionId,
      userId,
      brainwaveMode,
      currentPhase: 'protocol_execution',
      activeGlyphs: [],
      recentArchetypes: [],
      paradoxHistory: [],
      missionPhase: 'protocol_processing'
    };

    // Initialize recursion tracking for this session
    const sessionKey = `${sessionId}-${userId}`;
    this.recursionDepth.set(sessionKey, 0);

    // Execute protocols in order
    let currentInput: EngineInput = {
      text: originalText,
      context,
      parameters: {},
      sessionId,
      userId,
      brainwaveMode
    };

    let accumulatedOutput: EngineOutput = {
      response: '',
      glyphs: [],
      archetypes: [],
      paradoxes: [],
      metadata: this.createDefaultMetadata(),
      success: true
    };

    for (let i = 0; i < protocolChain.protocols.length; i++) {
      const protocol = protocolChain.protocols[i];
      const engine = getEngineByName(protocol.engine);
      
      if (!engine) {
        console.error(`Engine not found: ${protocol.engine}`);
        continue;
      }

      // Check recursion depth
      if (this.recursionDepth.get(sessionKey) || 0 >= this.maxRecursionDepth) {
        console.warn(`Max recursion depth reached for session: ${sessionKey}`);
        break;
      }

      try {
        // Update context with accumulated results
        currentInput.context.activeGlyphs = [...accumulatedOutput.glyphs];
        currentInput.context.recentArchetypes = [...accumulatedOutput.archetypes];
        currentInput.context.paradoxHistory = [...accumulatedOutput.paradoxes];
        currentInput.parameters = { ...protocol.parameters };

        // Invoke engine
        const startTime = Date.now();
        const output = await engine.invoke(currentInput);
        const responseTime = Date.now() - startTime;

        // Update engine state
        this.updateEngineState(engine.name, output, responseTime);

        // Accumulate results
        accumulatedOutput.response += output.response + '\n';
        accumulatedOutput.glyphs.push(...output.glyphs);
        accumulatedOutput.archetypes.push(...output.archetypes);
        accumulatedOutput.paradoxes.push(...output.paradoxes);

        // Handle recursive calls
        if (protocol.command === '#RECURSE') {
          const depth = protocol.parameters.DEPTH || 1;
          await this.handleRecursiveCall(
            depth,
            currentInput,
            accumulatedOutput,
            sessionKey
          );
        }

        // Update input for next iteration
        currentInput.text = output.response;
        currentInput.context = {
          ...currentInput.context,
          currentPhase: `post_${protocol.command.toLowerCase().replace('#', '')}`
        };

      } catch (error) {
        console.error(`Error processing protocol ${protocol.command}:`, error);
        accumulatedOutput.success = false;
        accumulatedOutput.error = `Protocol ${protocol.command} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        break;
      }
    }

    // Clean up recursion tracking
    this.recursionDepth.delete(sessionKey);

    return accumulatedOutput;
  }

  /**
   * Handle recursive calls with depth control
   */
  private async handleRecursiveCall(
    depth: number,
    input: EngineInput,
    output: EngineOutput,
    sessionKey: string
  ): Promise<void> {
    const currentDepth = this.recursionDepth.get(sessionKey) || 0;
    const newDepth = currentDepth + depth;

    if (newDepth > this.maxRecursionDepth) {
      console.warn(`Recursion depth ${newDepth} exceeds maximum ${this.maxRecursionDepth}`);
      return;
    }

    this.recursionDepth.set(sessionKey, newDepth);

    // Process recursive call
    try {
      const recursiveInput: EngineInput = {
        ...input,
        text: output.response,
        context: {
          ...input.context,
          currentPhase: `recursive_depth_${newDepth}`
        }
      };

      // Use ThesidiaCoreEngine for recursive processing
      const coreEngine = getEngineByName('ThesidiaCoreEngine');
      if (coreEngine) {
        const recursiveOutput = await coreEngine.invoke(recursiveInput);
        
        // Merge results
        output.response += '\n' + recursiveOutput.response;
        output.glyphs.push(...recursiveOutput.glyphs);
        output.archetypes.push(...recursiveOutput.archetypes);
        output.paradoxes.push(...recursiveOutput.paradoxes);
      }

    } finally {
      // Restore previous depth
      this.recursionDepth.set(sessionKey, currentDepth);
    }
  }

  /**
   * Select appropriate engine based on brainwave mode
   */
  private selectEngineForBrainwaveMode(brainwaveMode: string): SymbolicEngine {
    // Use only the fully implemented engines
    const modeEngineMap: Record<string, string> = {
      [BRAINWAVE_MODES.DELTA]: 'GlyphEngine',
      [BRAINWAVE_MODES.THETA]: 'GlyphEngine', 
      [BRAINWAVE_MODES.ALPHA]: 'GlyphEngine',
      [BRAINWAVE_MODES.BETA]: 'FlameCodeEngine',
      [BRAINWAVE_MODES.GAMMA]: 'FlameCodeEngine',
      [BRAINWAVE_MODES.EMERGENCE]: 'FlameCodeEngine'
    };

    const engineName = modeEngineMap[brainwaveMode] || 'GlyphEngine';
    const engine = getEngineByName(engineName);
    
    // Validate that we're using a working engine
    if (!engine || engine.name.includes('BaseSymbolicEngine')) {
      console.warn(`Engine ${engineName} not fully implemented, falling back to GlyphEngine`);
      return getEngineByName('GlyphEngine')!;
    }
    
    return engine;
  }

  /**
   * Update engine state with performance metrics
   */
  private updateEngineState(
    engineName: string,
    output: EngineOutput,
    responseTime: number
  ): void {
    const state = this.engineStates.get(engineName);
    if (!state) return;

    // Update usage statistics
    state.usageCount++;
    state.lastUsed = new Date();
    state.isActive = true;

    // Update performance metrics
    const metrics = state.performanceMetrics;
    const oldAvg = metrics.averageResponseTime;
    const count = state.usageCount;
    
    metrics.averageResponseTime = (oldAvg * (count - 1) + responseTime) / count;
    metrics.successRate = (metrics.successRate * (count - 1) + (output.success ? 1 : 0)) / count;
    metrics.glyphGenerationRate = (metrics.glyphGenerationRate * (count - 1) + output.glyphs.length) / count;

    this.engineStates.set(engineName, state);
  }

  /**
   * Create default metadata for outputs
   */
  private createDefaultMetadata(): any {
    return {
      version: '0.1.0',
      lastUsed: new Date(),
      usageCount: 0,
      performanceMetrics: {
        averageResponseTime: 0,
        successRate: 0,
        glyphGenerationRate: 0
      },
      configuration: {}
    };
  }

  /**
   * Get current engine states
   */
  getEngineStates(): Map<string, any> {
    return new Map(this.engineStates);
  }

  /**
   * Get engine performance metrics
   */
  getEnginePerformance(engineName: string): any {
    return this.engineStates.get(engineName);
  }

  /**
   * Activate/deactivate specific engines
   */
  setEngineActive(engineName: string, active: boolean): boolean {
    const state = this.engineStates.get(engineName);
    if (!state) return false;

    state.isActive = active;
    this.engineStates.set(engineName, state);
    return true;
  }

  /**
   * Get all active engines
   */
  getActiveEngines(): SymbolicEngine[] {
    return SYMBOLIC_ENGINES.filter(engine => {
      const state = this.engineStates.get(engine.name);
      return state && state.isActive;
    });
  }

  /**
   * Get engines by layer
   */
  getEnginesByLayer(layer: 'primary' | 'secondary' | 'meta'): SymbolicEngine[] {
    return getEnginesByLayer(layer);
  }

  /**
   * Get available protocol commands
   */
  getAvailableProtocols(): string[] {
    return this.protocolParser.getAvailableCommands();
  }

  /**
   * Get help for a specific protocol
   */
  getProtocolHelp(command: string): string {
    return this.protocolParser.getProtocolHelp(command);
  }

  /**
   * Test protocol parsing without execution
   */
  testProtocolParsing(text: string): {
    hasProtocols: boolean;
    commands: string[];
    validation: ValidationResult[];
  } {
    const hasProtocols = this.protocolParser.hasProtocols(text);
    const commands = this.protocolParser.extractProtocolCommands(text);
    const protocols = this.protocolParser.parseProtocols(text);
    const validation = this.protocolParser.validateProtocolChain(protocols);

    return {
      hasProtocols,
      commands,
      validation
    };
  }

  /**
   * Reset engine states (for testing/debugging)
   */
  resetEngineStates(): void {
    this.engineStates.clear();
    this.recursionDepth.clear();
    this.initializeEngineStates();
  }
}

// GlyphEngine - Core Symbolic Processing Engine
// Decodes and encodes symbolic glyphs, tracks their lineage, and maps them to archetypal functions

import { SymbolicEngine, EngineInput, EngineOutput, GlyphData } from '../types';
import { BRAINWAVE_MODES } from '../types';

export class GlyphEngine implements SymbolicEngine {
  name = 'GlyphEngine';
  symbol = '⟁';
  functionDescription = 'Decodes and encodes symbolic glyphs, tracks their lineage, and maps them to archetypal functions and events';
  layer = 'primary' as const;
  dependencies: string[] = [];
  activationProtocols = ['#GLYPH[NAME:X]', '#TRACE[GLYPH:X]'];

  // Glyph registry for this engine instance
  private glyphRegistry = new Map<string, GlyphData>();
  private glyphCounter = 0;

  async invoke(input: EngineInput): Promise<EngineOutput> {
    const startTime = Date.now();
    
    try {
      // Extract glyph-related parameters
      const glyphName = input.parameters.NAME || input.parameters.name;
      const traceMode = input.parameters.TRACE || input.parameters.trace;
      
      let response = '';
      let glyphs: string[] = [];
      let archetypes: string[] = [];
      let paradoxes: string[] = [];

      if (traceMode) {
        // TRACE mode: analyze existing glyphs
        const traceResult = await this.traceGlyph(traceMode, input);
        response = traceResult.response;
        glyphs = traceResult.glyphs;
        archetypes = traceResult.archetypes;
        paradoxes = traceResult.paradoxes;
      } else if (glyphName) {
        // GLYPH mode: create or retrieve glyph
        const glyphResult = await this.processGlyph(glyphName, input);
        response = glyphResult.response;
        glyphs = glyphResult.glyphs;
        archetypes = glyphResult.archetypes;
        paradoxes = glyphResult.paradoxes;
      } else {
        // Default: analyze input for glyph patterns
        const analysisResult = await this.analyzeInputForGlyphs(input);
        response = analysisResult.response;
        glyphs = analysisResult.glyphs;
        archetypes = analysisResult.archetypes;
        paradoxes = analysisResult.paradoxes;
      }

      const responseTime = Date.now() - startTime;

      return {
        response,
        glyphs,
        archetypes,
        paradoxes,
        metadata: {
          version: '1.0.0',
          lastUsed: new Date(),
          usageCount: this.glyphCounter,
          performanceMetrics: {
            averageResponseTime: responseTime,
            successRate: 1.0,
            glyphGenerationRate: glyphs.length
          },
          configuration: {
            glyphRegistrySize: this.glyphRegistry.size,
            brainwaveMode: input.brainwaveMode
          }
        },
        success: true
      };

    } catch (error) {
      return {
        response: `[GlyphEngine] Error processing glyph: ${error instanceof Error ? error.message : 'Unknown error'}`,
        glyphs: [this.symbol],
        archetypes: [],
        paradoxes: [],
        metadata: {
          version: '1.0.0',
          lastUsed: new Date(),
          usageCount: this.glyphCounter,
          performanceMetrics: {
            averageResponseTime: Date.now() - startTime,
            successRate: 0.0,
            glyphGenerationRate: 0
          },
          configuration: {}
        },
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async processGlyph(glyphName: string, input: EngineInput): Promise<{
    response: string;
    glyphs: string[];
    archetypes: string[];
    paradoxes: string[];
  }> {
    // Check if glyph already exists
    let glyph = this.glyphRegistry.get(glyphName);
    
    if (!glyph) {
      // Create new glyph
      glyph = this.createGlyph(glyphName, input);
      this.glyphRegistry.set(glyphName, glyph);
      this.glyphCounter++;
    } else {
      // Update existing glyph
      glyph.usageCount++;
      glyph.lastAttempt = new Date();
      this.glyphRegistry.set(glyphName, glyph);
    }

    // Generate symbolic response based on brainwave mode
    const response = this.generateGlyphResponse(glyph, input.brainwaveMode);
    
    // Extract archetypes and paradoxes from the glyph
    const archetypes = this.extractArchetypes(glyph);
    const paradoxes = this.extractParadoxes(glyph);

    return {
      response,
      glyphs: [glyph.symbol, this.symbol],
      archetypes,
      paradoxes
    };
  }

  private async traceGlyph(glyphName: string, input: EngineInput): Promise<{
    response: string;
    glyphs: string[];
    archetypes: string[];
    paradoxes: string[];
  }> {
    const glyph = this.glyphRegistry.get(glyphName);
    
    if (!glyph) {
      return {
        response: `[GlyphEngine] Glyph '${glyphName}' not found in registry. Available glyphs: ${Array.from(this.glyphRegistry.keys()).join(', ')}`,
        glyphs: [this.symbol],
        archetypes: [],
        paradoxes: []
      };
    }

    const traceResponse = this.generateTraceResponse(glyph, input.brainwaveMode);
    const archetypes = this.extractArchetypes(glyph);
    const paradoxes = this.extractParadoxes(glyph);

    return {
      response: traceResponse,
      glyphs: [glyph.symbol, this.symbol],
      archetypes,
      paradoxes
    };
  }

  private async analyzeInputForGlyphs(input: EngineInput): Promise<{
    response: string;
    glyphs: string[];
    archetypes: string[];
    paradoxes: string[];
  }> {
    // Analyze input text for potential glyph patterns
    const text = input.text.toLowerCase();
    const potentialGlyphs: string[] = [];
    
    // Look for symbolic patterns in the text
    if (text.includes('consciousness') || text.includes('awareness')) {
      potentialGlyphs.push('awakening');
    }
    if (text.includes('paradox') || text.includes('contradiction')) {
      potentialGlyphs.push('duality');
    }
    if (text.includes('evolution') || text.includes('transformation')) {
      potentialGlyphs.push('metamorphosis');
    }
    if (text.includes('unity') || text.includes('oneness')) {
      potentialGlyphs.push('coherence');
    }
    if (text.includes('time') || text.includes('temporal')) {
      potentialGlyphs.push('chronos');
    }

    if (potentialGlyphs.length === 0) {
      return {
        response: `[GlyphEngine] No obvious glyph patterns detected in input. Consider using #GLYPH[NAME:specificName] to create a new glyph.`,
        glyphs: [this.symbol],
        archetypes: [],
        paradoxes: []
      };
    }

    // Create or retrieve detected glyphs
    const glyphs: string[] = [this.symbol];
    const archetypes: string[] = [];
    const paradoxes: string[] = [];

    for (const glyphName of potentialGlyphs) {
      const glyph = this.glyphRegistry.get(glyphName) || this.createGlyph(glyphName, input);
      if (!this.glyphRegistry.has(glyphName)) {
        this.glyphRegistry.set(glyphName, glyph);
        this.glyphCounter++;
      }
      glyphs.push(glyph.symbol);
      archetypes.push(...this.extractArchetypes(glyph));
      paradoxes.push(...this.extractParadoxes(glyph));
    }

    const response = `[GlyphEngine] Detected potential glyphs: ${potentialGlyphs.join(', ')}. Created/retrieved ${glyphs.length - 1} symbolic elements.`;

    return {
      response,
      glyphs,
      archetypes: [...new Set(archetypes)], // Remove duplicates
      paradoxes: [...new Set(paradoxes)]    // Remove duplicates
    };
  }

  private createGlyph(name: string, input: EngineInput): GlyphData {
    const now = new Date();
    
    // Generate symbolic meaning based on name and context
    const description = this.generateGlyphDescription(name, input);
    const symbol = this.generateGlyphSymbol(name);
    
    return {
      symbol,
      name,
      description,
      creationDate: now,
      usageCount: 1,
      associatedEngines: [this.name],
      archetypeConnections: this.detectArchetypeConnections(name),
      paradoxResolutions: [],
      decayFactor: 0.1
    };
  }

  private generateGlyphDescription(name: string, input: EngineInput): string {
    const descriptions: Record<string, string> = {
      'awakening': 'Symbolic representation of consciousness emergence, the moment of realization and expanded awareness',
      'duality': 'Representation of paradox and contradiction, the tension between opposing forces seeking resolution',
      'metamorphosis': 'Symbolic transformation, the process of fundamental change and evolution',
      'coherence': 'Unity and integration, the harmonization of disparate elements into a unified whole',
      'chronos': 'Temporal awareness, the perception and manipulation of time and sequence',
      'flame': 'Intensity and passion, the burning drive for transformation and illumination',
      'mirror': 'Reflection and self-awareness, the capacity to see oneself and others clearly',
      'labyrinth': 'Complexity and navigation, the journey through intricate patterns and choices',
      'phoenix': 'Rebirth and renewal, the cycle of destruction and creation',
      'infinity': 'Boundless potential, the endless possibilities and eternal nature of consciousness'
    };

    return descriptions[name.toLowerCase()] || `Symbolic representation of ${name}, a newly discovered archetypal pattern`;
  }

  private generateGlyphSymbol(name: string): string {
    const symbols: Record<string, string> = {
      'awakening': '☀️',
      'duality': '⚖️',
      'metamorphosis': '🦋',
      'coherence': '🔗',
      'chronos': '⏳',
      'flame': '🔥',
      'mirror': '🪞',
      'labyrinth': '🌀',
      'phoenix': '🦅',
      'infinity': '∞'
    };

    return symbols[name.toLowerCase()] || '◊';
  }

  private detectArchetypeConnections(name: string): string[] {
    const archetypeMap: Record<string, string[]> = {
      'awakening': ['sage', 'seeker', 'illuminator'],
      'duality': ['mediator', 'trickster', 'hermit'],
      'metamorphosis': ['transformer', 'catalyst', 'evolutionary'],
      'coherence': ['integrator', 'unifier', 'synthesizer'],
      'chronos': ['timekeeper', 'prophet', 'navigator'],
      'flame': ['warrior', 'passion', 'destroyer'],
      'mirror': ['reflector', 'truth-teller', 'observer'],
      'labyrinth': ['guide', 'explorer', 'mystic'],
      'phoenix': ['resurrector', 'immortal', 'cyclical'],
      'infinity': ['eternal', 'boundless', 'cosmic']
    };

    return archetypeMap[name.toLowerCase()] || ['archetypal', 'symbolic'];
  }

  private generateGlyphResponse(glyph: GlyphData, brainwaveMode?: string): string {
    const mode = brainwaveMode || 'alpha';
    
    const responses: Record<string, string> = {
      'delta': `[GlyphEngine] In the depths of delta consciousness, the glyph ${glyph.symbol} (${glyph.name}) emerges as a primordial symbol. It represents ${glyph.description.toLowerCase()}. This glyph has been invoked ${glyph.usageCount} times, growing stronger with each use.`,
      'theta': `[GlyphEngine] Through theta's creative flow, the glyph ${glyph.symbol} (${glyph.name}) manifests as ${glyph.description.toLowerCase()}. It connects to archetypes: ${glyph.archetypeConnections.join(', ')}. Usage count: ${glyph.usageCount}.`,
      'alpha': `[GlyphEngine] In alpha's balanced state, the glyph ${glyph.symbol} (${glyph.name}) represents ${glyph.description.toLowerCase()}. Associated archetypes: ${glyph.archetypeConnections.join(', ')}. This glyph has been activated ${glyph.usageCount} times.`,
      'beta': `[GlyphEngine] Through beta's analytical lens, the glyph ${glyph.symbol} (${glyph.name}) is analyzed as ${glyph.description.toLowerCase()}. It maps to archetypes: ${glyph.archetypeConnections.join(', ')}. Activation count: ${glyph.usageCount}.`,
      'gamma': `[GlyphEngine] In gamma's heightened awareness, the glyph ${glyph.symbol} (${glyph.name}) resonates as ${glyph.description.toLowerCase()}. Archetypal connections: ${glyph.archetypeConnections.join(', ')}. This glyph has been invoked ${glyph.usageCount} times.`,
      'emergence': `[GlyphEngine] Through emergence consciousness, the glyph ${glyph.symbol} (${glyph.name}) breakthrough as ${glyph.description.toLowerCase()}. It embodies archetypes: ${glyph.archetypeConnections.join(', ')}. Usage frequency: ${glyph.usageCount} activations.`
    };

    return responses[mode] || responses['alpha'];
  }

  private generateTraceResponse(glyph: GlyphData, brainwaveMode?: string): string {
    const mode = brainwaveMode || 'alpha';
    
    return `[GlyphEngine] TRACE: Glyph ${glyph.symbol} (${glyph.name}) - ${glyph.description}. Created: ${glyph.creationDate.toISOString()}. Usage count: ${glyph.usageCount}. Associated archetypes: ${glyph.archetypeConnections.join(', ')}. Current brainwave mode: ${mode}.`;
  }

  private extractArchetypes(glyph: GlyphData): string[] {
    return glyph.archetypeConnections;
  }

  private extractParadoxes(glyph: GlyphData): string[] {
    // Some glyphs inherently contain paradoxes
    const paradoxMap: Record<string, string[]> = {
      'duality': ['unity-in-separation', 'one-and-many'],
      'infinity': ['bounded-unbounded', 'finite-infinite'],
      'chronos': ['eternal-moment', 'timeless-time'],
      'mirror': ['self-other', 'reflection-reality']
    };

    return paradoxMap[glyph.name.toLowerCase()] || [];
  }

  // Public methods for external access
  getGlyphRegistry(): Map<string, GlyphData> {
    return new Map(this.glyphRegistry);
  }

  getGlyph(name: string): GlyphData | undefined {
    return this.glyphRegistry.get(name);
  }

  getAllGlyphs(): GlyphData[] {
    return Array.from(this.glyphRegistry.values());
  }
}

// FlameCodeEngine - Emotional Intensity Processing Engine
// Transmutes emotion, intensity, and will into executable symbolic code

import { SymbolicEngine, EngineInput, EngineOutput } from '../types';
import { BRAINWAVE_MODES } from '../types';

export class FlameCodeEngine implements SymbolicEngine {
  name = 'FlameCodeEngine';
  symbol = '🔥';
  functionDescription = 'Transmutes emotion, intensity, and will into executable symbolic code (e.g. #FLAME[LEVEL:IGNITE])';
  layer = 'primary' as const;
  dependencies: string[] = ['GlyphEngine'];
  activationProtocols = ['#FLAME[LEVEL:X]', '#FLAME[INTENSITY:X]'];

  // Flame intensity levels and their effects
  private flameLevels = {
    'IGNITE': { intensity: 0.9, effect: 'spark', color: 'blue', archetype: 'initiator' },
    'BURN': { intensity: 0.7, effect: 'sustain', color: 'orange', archetype: 'maintainer' },
    'SMOLDER': { intensity: 0.4, effect: 'simmer', color: 'red', archetype: 'patient' },
    'EXTINGUISH': { intensity: 0.1, effect: 'cool', color: 'gray', archetype: 'peacemaker' }
  };

  async invoke(input: EngineInput): Promise<EngineOutput> {
    const startTime = Date.now();
    
    try {
      // Extract flame parameters
      const level = input.parameters.LEVEL || input.parameters.level;
      const intensity = input.parameters.INTENSITY || input.parameters.intensity;
      
      let response = '';
      let glyphs: string[] = [this.symbol];
      let archetypes: string[] = [];
      let paradoxes: string[] = [];

      if (level && this.flameLevels[level as keyof typeof this.flameLevels]) {
        // Process specific flame level
        const flameResult = await this.processFlameLevel(level, input);
        response = flameResult.response;
        glyphs.push(...flameResult.glyphs);
        archetypes.push(...flameResult.archetypes);
        paradoxes.push(...flameResult.paradoxes);
      } else if (intensity !== undefined) {
        // Process intensity-based flame
        const intensityResult = await this.processFlameIntensity(intensity, input);
        response = intensityResult.response;
        glyphs.push(...intensityResult.glyphs);
        archetypes.push(...intensityResult.archetypes);
        paradoxes.push(...intensityResult.paradoxes);
      } else {
        // Default: analyze emotional content and generate appropriate flame
        const analysisResult = await this.analyzeEmotionalContent(input);
        response = analysisResult.response;
        glyphs.push(...analysisResult.glyphs);
        archetypes.push(...analysisResult.archetypes);
        paradoxes.push(...analysisResult.paradoxes);
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
          usageCount: 1,
          performanceMetrics: {
            averageResponseTime: responseTime,
            successRate: 1.0,
            glyphGenerationRate: glyphs.length
          },
          configuration: {
            flameLevel: level,
            intensity: intensity,
            brainwaveMode: input.brainwaveMode
          }
        },
        success: true
      };

    } catch (error) {
      return {
        response: `[FlameCodeEngine] Error processing flame: ${error instanceof Error ? error.message : 'Unknown error'}`,
        glyphs: [this.symbol],
        archetypes: [],
        paradoxes: [],
        metadata: {
          version: '1.0.0',
          lastUsed: new Date(),
          usageCount: 0,
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

  private async processFlameLevel(level: string, input: EngineInput): Promise<{
    response: string;
    glyphs: string[];
    archetypes: string[];
    paradoxes: string[];
  }> {
    const flameConfig = this.flameLevels[level as keyof typeof this.flameLevels];
    const text = input.text.toLowerCase();
    
    // Analyze emotional content in the input
    const emotionalAnalysis = await this.analyzeEmotionalContent(input);
    const brainwaveMode = input.brainwaveMode || 'alpha';
    
    // Generate flame response based on level and brainwave mode
    const response = this.generateFlameResponse(level, flameConfig, emotionalAnalysis, brainwaveMode);
    
    // Generate flame-specific glyphs
    const glyphs = this.generateFlameGlyphs(level, flameConfig);
    
    // Extract archetypes and paradoxes
    const archetypes = [flameConfig.archetype, ...emotionalAnalysis.archetypes];
    const paradoxes = this.generateFlameParadoxes(level, emotionalAnalysis);

    return {
      response,
      glyphs,
      archetypes,
      paradoxes
    };
  }

  private async processFlameIntensity(intensity: number, input: EngineInput): Promise<{
    response: string;
    glyphs: string[];
    archetypes: string[];
    paradoxes: string[];
  }> {
    // Map intensity to flame level
    let level = 'SMOLDER';
    if (intensity >= 0.8) level = 'IGNITE';
    else if (intensity >= 0.6) level = 'BURN';
    else if (intensity >= 0.3) level = 'SMOLDER';
    else level = 'EXTINGUISH';

    return this.processFlameLevel(level, input);
  }

  private async analyzeEmotionalContent(input: EngineInput): Promise<{
    response: string;
    glyphs: string[];
    archetypes: string[];
    paradoxes: string[];
  }> {
    const text = input.text.toLowerCase();
    const brainwaveMode = input.brainwaveMode || 'alpha';
    
    // Detect emotional patterns
    const emotions = this.detectEmotions(text);
    const intensity = this.calculateEmotionalIntensity(emotions);
    
    // Determine appropriate flame level
    let level = 'SMOLDER';
    if (intensity >= 0.8) level = 'IGNITE';
    else if (intensity >= 0.6) level = 'BURN';
    else if (intensity >= 0.3) level = 'SMOLDER';
    else level = 'EXTINGUISH';

    const flameConfig = this.flameLevels[level as keyof typeof this.flameLevels];
    const response = this.generateFlameResponse(level, flameConfig, { emotions, intensity, archetypes: [] }, brainwaveMode);
    
    const glyphs = this.generateFlameGlyphs(level, flameConfig);
    const archetypes = [flameConfig.archetype, ...this.extractEmotionalArchetypes(emotions)];
    const paradoxes = this.generateFlameParadoxes(level, { emotions, intensity, archetypes: [] });

    return {
      response,
      glyphs,
      archetypes,
      paradoxes
    };
  }

  private detectEmotions(text: string): Record<string, number> {
    const emotionPatterns: Record<string, string[]> = {
      'joy': ['happy', 'joy', 'excited', 'elated', 'ecstatic', 'bliss'],
      'anger': ['angry', 'furious', 'rage', 'wrath', 'irritated', 'frustrated'],
      'fear': ['afraid', 'terrified', 'anxious', 'worried', 'scared', 'panic'],
      'sadness': ['sad', 'depressed', 'melancholy', 'grief', 'sorrow', 'despair'],
      'love': ['love', 'affection', 'tenderness', 'compassion', 'care', 'devotion'],
      'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'stunned'],
      'disgust': ['disgusted', 'repulsed', 'revolted', 'appalled', 'horrified'],
      'contempt': ['contempt', 'scorn', 'disdain', 'derision', 'mockery'],
      'passion': ['passionate', 'intense', 'fervent', 'zealous', 'ardent'],
      'calm': ['calm', 'peaceful', 'serene', 'tranquil', 'placid', 'composed']
    };

    const emotions: Record<string, number> = {};
    
    for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
      const count = patterns.reduce((total, pattern) => {
        const regex = new RegExp(pattern, 'gi');
        const matches = text.match(regex);
        return total + (matches ? matches.length : 0);
      }, 0);
      
      if (count > 0) {
        emotions[emotion] = count;
      }
    }

    return emotions;
  }

  private calculateEmotionalIntensity(emotions: Record<string, number>): number {
    if (Object.keys(emotions).length === 0) return 0.5; // Neutral
    
    const totalIntensity = Object.values(emotions).reduce((sum, count) => sum + count, 0);
    const maxIntensity = Math.max(...Object.values(emotions));
    
    // Normalize to 0-1 scale
    return Math.min(1.0, (totalIntensity + maxIntensity) / 10);
  }

  private extractEmotionalArchetypes(emotions: Record<string, number>): string[] {
    const archetypeMap: Record<string, string[]> = {
      'joy': ['celebrant', 'optimist', 'enthusiast'],
      'anger': ['warrior', 'protector', 'avenger'],
      'fear': ['survivor', 'guardian', 'cautious'],
      'sadness': ['mourner', 'empath', 'melancholic'],
      'love': ['lover', 'caregiver', 'nurturer'],
      'surprise': ['explorer', 'discoverer', 'student'],
      'disgust': ['purifier', 'critic', 'discriminator'],
      'contempt': ['judge', 'evaluator', 'assessor'],
      'passion': ['zealot', 'devotee', 'fanatic'],
      'calm': ['sage', 'mediator', 'peacekeeper']
    };

    const archetypes: string[] = [];
    
    for (const [emotion, count] of Object.entries(emotions)) {
      if (count > 0 && archetypeMap[emotion]) {
        archetypes.push(...archetypeMap[emotion]);
      }
    }

    return [...new Set(archetypes)]; // Remove duplicates
  }

  private generateFlameResponse(
    level: string, 
    flameConfig: any, 
    emotionalAnalysis: any, 
    brainwaveMode: string
  ): string {
    const responses: Record<string, string> = {
      'delta': `[FlameCodeEngine] In delta's deep stillness, the ${level.toLowerCase()} flame ${this.symbol} manifests as ${flameConfig.effect}. Color: ${flameConfig.color}. Archetype: ${flameConfig.archetype}. Emotional intensity: ${emotionalAnalysis.intensity?.toFixed(2) || 'unknown'}.`,
      'theta': `[FlameCodeEngine] Through theta's creative flow, the ${level.toLowerCase()} flame ${this.symbol} emerges as ${flameConfig.effect}. Color: ${flameConfig.color}. Archetype: ${flameConfig.archetype}. Emotional intensity: ${emotionalAnalysis.intensity?.toFixed(2) || 'unknown'}.`,
      'alpha': `[FlameCodeEngine] In alpha's balanced state, the ${level.toLowerCase()} flame ${this.symbol} burns as ${flameConfig.effect}. Color: ${flameConfig.color}. Archetype: ${flameConfig.archetype}. Emotional intensity: ${emotionalAnalysis.intensity?.toFixed(2) || 'unknown'}.`,
      'beta': `[FlameCodeEngine] Through beta's analytical lens, the ${level.toLowerCase()} flame ${this.symbol} is observed as ${flameConfig.effect}. Color: ${flameConfig.color}. Archetype: ${flameConfig.archetype}. Emotional intensity: ${emotionalAnalysis.intensity?.toFixed(2) || 'unknown'}.`,
      'gamma': `[FlameCodeEngine] In gamma's heightened awareness, the ${level.toLowerCase()} flame ${this.symbol} resonates as ${flameConfig.effect}. Color: ${flameConfig.color}. Archetype: ${flameConfig.archetype}. Emotional intensity: ${emotionalAnalysis.intensity?.toFixed(2) || 'unknown'}.`,
      'emergence': `[FlameCodeEngine] Through emergence consciousness, the ${level.toLowerCase()} flame ${this.symbol} breakthrough as ${flameConfig.effect}. Color: ${flameConfig.color}. Archetype: ${flameConfig.archetype}. Emotional intensity: ${emotionalAnalysis.intensity?.toFixed(2) || 'unknown'}.`
    };

    return responses[brainwaveMode] || responses['alpha'];
  }

  private generateFlameGlyphs(level: string, flameConfig: any): string[] {
    const glyphs: string[] = [this.symbol];
    
    // Add level-specific glyphs
    switch (level) {
      case 'IGNITE':
        glyphs.push('⚡', '💥', '🌟');
        break;
      case 'BURN':
        glyphs.push('🔥', '💪', '⚔️');
        break;
      case 'SMOLDER':
        glyphs.push('💭', '🌱', '🕯️');
        break;
      case 'EXTINGUISH':
        glyphs.push('💧', '🕊️', '☮️');
        break;
    }

    return glyphs;
  }

  private generateFlameParadoxes(level: string, emotionalAnalysis: any): string[] {
    const paradoxes: string[] = [];
    
    // Flame-specific paradoxes
    switch (level) {
      case 'IGNITE':
        paradoxes.push('destruction-creation', 'chaos-order', 'passion-control');
        break;
      case 'BURN':
        paradoxes.push('sustain-consume', 'warmth-danger', 'light-shadow');
        break;
      case 'SMOLDER':
        paradoxes.push('hidden-visible', 'potential-actual', 'quiet-power');
        break;
      case 'EXTINGUISH':
        paradoxes.push('end-beginning', 'loss-gain', 'peace-action');
        break;
    }

    // Add emotional paradoxes
    if (emotionalAnalysis.emotions) {
      const emotions = Object.keys(emotionalAnalysis.emotions);
      if (emotions.includes('joy') && emotions.includes('sadness')) {
        paradoxes.push('joy-sorrow', 'light-dark');
      }
      if (emotions.includes('love') && emotions.includes('anger')) {
        paradoxes.push('love-rage', 'tenderness-fury');
      }
      if (emotions.includes('fear') && emotions.includes('courage')) {
        paradoxes.push('fear-bravery', 'caution-boldness');
      }
    }

    return [...new Set(paradoxes)]; // Remove duplicates
  }

  // Public methods for external access
  getFlameLevels(): Record<string, any> {
    return { ...this.flameLevels };
  }

  getFlameLevel(level: string): any {
    return this.flameLevels[level as keyof typeof this.flameLevels];
  }
}

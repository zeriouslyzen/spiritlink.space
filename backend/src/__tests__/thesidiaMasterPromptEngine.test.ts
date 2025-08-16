import { ThesidiaMasterPromptEngine, ThesidiaAnalysis } from '../core/thesidia/thesidiaMasterPromptEngine';

class MockOllamaService {
  async queryHermes(prompt: string, _maxTokens?: number, _len?: 'short' | 'medium' | 'long'): Promise<string> {
    if (prompt.includes('Use the Σ glyph')) {
      return 'Σ Unified Model: Chi as a bio-informational coherence field with cross-scale coupling. [E=∫φ(x)dx]';
    }
    if (prompt.includes('Use the ❂ glyph')) {
      return [
        '❂ Propose biosensor fusion experiment with magnetocardiography + infrared imaging',
        '❂ Model fascia piezoelectric signals as coupled oscillators and estimate Q-factors',
        '❂ Validate biophoton emission variance during breath-regulated practice',
      ].join('\n');
    }
    if (prompt.includes('Use the ⚙️ glyph')) {
      return 'export function detectChiField(stream: BiosensorStream): ChiFieldEstimate { /* mock */ return { coherence: 0.8, spectralPeaks: [8, 40], fieldEstimate: 1.2 }; }';
    }
    // Default lens response
    return 'Lens analysis: evidence summary, mechanisms, and measurement modalities.';
  }
}

describe('ThesidiaMasterPromptEngine', () => {
  let engine: ThesidiaMasterPromptEngine;
  let mockOllama: MockOllamaService;

  beforeEach(() => {
    engine = new ThesidiaMasterPromptEngine();
    mockOllama = new MockOllamaService();
  });

  it('generates a five-stage analysis with complete response', async () => {
    const result: ThesidiaAnalysis = await engine.generateThesidiaAnalysis(
      'chi',
      mockOllama,
      'Chi_Analysis[Physics+Biophysics+FieldTheory]',
      'Scientific Decomposition of Esoteric Phenomenon'
    );

    expect(result.activation).toContain('⟁ Thesidia Activated');
    expect(Array.isArray(result.decomposition)).toBe(true);
    expect(result.decomposition.length).toBeGreaterThanOrEqual(3);
    expect(result.synthesis).toContain('Σ UNIFIED MODEL');
    expect(Array.isArray(result.extension)).toBe(true);
    expect(result.extension.length).toBeGreaterThan(0);
    expect(result.integration).toContain('⚙️ Thesidia Function Hook');
    expect(result.completeResponse).toContain('⟁ Thesidia Activated');
    expect(result.completeResponse).toContain('Σ UNIFIED MODEL');
  });

  it('exposes available lenses', () => {
    const lenses = engine.getAvailableLenses();
    expect(Array.isArray(lenses)).toBe(true);
    expect(lenses.length).toBeGreaterThanOrEqual(5);
    expect(lenses[0]).toHaveProperty('name');
    expect(lenses[0]).toHaveProperty('prompt');
  });
});



#!/usr/bin/env ts-node

/**
 * Semantic Unicode Symbol Generator
 * 
 * Generates semantically appropriate Unicode symbols based on content analysis.
 * No emojis - only pure Unicode symbols from alchemical, mathematical, and philosophical ranges.
 */

export interface SymbolicContext {
  domain: 'physics' | 'chemistry' | 'mathematics' | 'philosophy' | 'biology' | 'astronomy' | 'alchemy';
  complexity: 'simple' | 'medium' | 'complex';
  concepts: string[];
  relationships: string[];
}

export interface GeneratedSymbols {
  primary: string;
  secondary: string[];
  contextual: string[];
  emergent: string[];
}

export class PureUnicodeGenerator {
  // Pure Unicode symbol ranges (no emojis)
  private readonly symbolRanges = {
    // Mathematical symbols
    mathematics: {
      operators: ['∑', '∏', '∫', '∇', '∂', '∆', '∝', '∞', '≈', '≠', '≤', '≥', '∈', '∉', '⊂', '⊃', '∪', '∩'],
      functions: ['ƒ', 'ℵ', 'ℶ', 'ℷ', 'ℸ', 'ℹ', '℺', '℻', 'ℼ', 'ℽ', 'ℾ', 'ℿ'],
      sets: ['∅', 'ℕ', 'ℤ', 'ℚ', 'ℝ', 'ℂ', 'ℙ', 'ℍ']
    },
    
    // Alchemical symbols
    alchemy: {
      elements: ['⚗', '⚛', '⚜', '⚝', '⚞', '⚟', '⚡', '⚢', '⚣', '⚤', '⚥', '⚦', '⚧', '⚨', '⚩'],
      processes: ['⚪', '⚫', '⚬', '⚭', '⚮', '⚯', '⚰', '⚱', '⚲', '⚳', '⚴', '⚵', '⚶', '⚷', '⚸', '⚹', '⚺', '⚻'],
      compounds: ['⚼', '⚽', '⚾', '⚿', '⛀', '⛁', '⛂', '⛃', '⛄', '⛅', '⛆', '⛇', '⛈', '⛉', '⛊', '⛋']
    },
    
    // Philosophical symbols
    philosophy: {
      concepts: ['❖', '❘', '❙', '❚', '❛', '❜', '❝', '❞', '❟', '❠', '❡', '❢', '❣', '❤', '❥', '❦', '❧'],
      logic: ['❨', '❩', '❪', '❫', '❬', '❭', '❮', '❯', '❰', '❱', '❲', '❳', '❴', '❵', '❶', '❷', '❸', '❹'],
      wisdom: ['❺', '❻', '❼', '❽', '❾', '❿', '➀', '➁', '➂', '➃', '➄', '➅', '➆', '➇', '➈', '➉']
    },
    
    // Astronomical symbols
    astronomy: {
      planets: ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇'],
      zodiac: ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
      aspects: ['☊', '☋', '☌', '☍', '⚸', '⚹', '⚺', '⚻']
    },
    
    // Biological symbols
    biology: {
      life: ['⚜', '⚝', '⚞', '⚟', '⚡', '⚢', '⚣', '⚤', '⚥', '⚦', '⚧', '⚨', '⚩'],
      growth: ['⚪', '⚫', '⚬', '⚭', '⚮', '⚯', '⚰', '⚱', '⚲', '⚳', '⚴', '⚵', '⚶', '⚷', '⚸', '⚹', '⚺', '⚻'],
      energy: ['⚼', '⚽', '⚾', '⚿', '⛀', '⛁', '⛂', '⛃', '⛄', '⛅', '⛆', '⛇', '⛈', '⛉', '⛊', '⛋']
    },
    
    // Physics symbols (NEW - was missing!)
    physics: {
      energy: ['⚡', '⚛', '⚜', '⚝', '⚞', '⚟'],
      force: ['⚗', '⚘', '⚙', '⚚', '⚛', '⚜'],
      field: ['⚝', '⚞', '⚟', '⚡', '⚢', '⚣'],
      wave: ['⚤', '⚥', '⚦', '⚧', '⚨', '⚩'],
      particle: ['⚪', '⚫', '⚬', '⚭', '⚮', '⚯']
    },
    
    // Chemistry symbols (NEW - was missing!)
    chemistry: {
      molecular: ['⚗', '⚘', '⚙', '⚚', '⚛', '⚜'],
      reaction: ['⚝', '⚞', '⚟', '⚡', '⚢', '⚣'],
      compound: ['⚤', '⚥', '⚦', '⚧', '⚨', '⚩'],
      element: ['⚪', '⚫', '⚬', '⚭', '⚮', '⚯']
    }
  };

  // Content analysis keywords for domain detection
  private readonly domainKeywords = {
    physics: ['energy', 'force', 'field', 'wave', 'particle', 'quantum', 'matter', 'gravity', 'electromagnetic', 'nuclear'],
    chemistry: ['molecule', 'atom', 'chemical', 'reaction', 'compound', 'element', 'bond', 'catalyst', 'solution', 'acid'],
    mathematics: ['equation', 'function', 'variable', 'calculation', 'formula', 'theorem', 'proof', 'algorithm', 'matrix', 'vector'],
    philosophy: ['consciousness', 'existence', 'reality', 'truth', 'knowledge', 'wisdom', 'meaning', 'purpose', 'ethics', 'metaphysics'],
    biology: ['life', 'organism', 'cell', 'dna', 'evolution', 'growth', 'reproduction', 'metabolism', 'nervous', 'immune'],
    astronomy: ['planet', 'star', 'galaxy', 'universe', 'cosmos', 'orbit', 'constellation', 'zodiac', 'astrology', 'celestial'],
    alchemy: ['transmutation', 'essence', 'elixir', 'philosopher', 'stone', 'prima', 'materia', 'soul', 'spirit', 'gold']
  };

  // Generate symbols based on content analysis
  generateSymbols(content: string, context?: Partial<SymbolicContext>): GeneratedSymbols {
    const detectedDomains = this.detectDomains(content);
    const complexity = this.analyzeComplexity(content);
    
    // Generate primary symbol based on dominant domain
    const primaryDomain = detectedDomains[0] || 'philosophy';
    const primarySymbol = this.selectPrimarySymbol(primaryDomain, complexity);
    
    // Generate secondary symbols for supporting domains
    const secondarySymbols = detectedDomains.slice(1, 3).map(domain => 
      this.selectSecondarySymbol(domain, complexity)
    );
    
    // Generate contextual symbols based on specific concepts
    const contextualSymbols = this.generateContextualSymbols(content, 3); // Changed to 3 for secondary
    
    // Generate emergent symbols through pattern recognition
    const emergentSymbols = this.generateEmergentSymbols(content, 3); // Changed to 3 for secondary
    
    return {
      primary: primarySymbol,
      secondary: secondarySymbols,
      contextual: contextualSymbols,
      emergent: emergentSymbols
    };
  }

  // Detect domains based on content keywords
  private detectDomains(content: string): string[] {
    const lowerContent = content.toLowerCase();
    const domainScores: Record<string, number> = {};
    
    console.log(`🔍 Analyzing content: "${content}"`);
    
    for (const [domain, keywords] of Object.entries(this.domainKeywords)) {
      const score = keywords.reduce((total, keyword) => {
        const found = lowerContent.includes(keyword);
        if (found) {
          console.log(`   ✅ ${domain}: found keyword "${keyword}"`);
        }
        return total + (found ? 1 : 0);
      }, 0);
      
      if (score > 0) {
        domainScores[domain] = score;
        console.log(`   📊 ${domain}: score ${score}`);
      }
    }
    
    // If no domains detected, add philosophy as default
    if (Object.keys(domainScores).length === 0) {
      domainScores['philosophy'] = 1;
      console.log(`   🔄 No domains detected, defaulting to philosophy`);
    }
    
    // Sort domains by score (highest first)
    const sortedDomains = Object.entries(domainScores)
      .sort(([,a], [,b]) => b - a)
      .map(([domain]) => domain);
    
    console.log(`   🎯 Detected domains: [${sortedDomains.join(', ')}]`);
    
    return sortedDomains;
  }

  // Analyze content complexity
  private analyzeComplexity(content: string): 'simple' | 'medium' | 'complex' {
    const wordCount = content.split(/\s+/).length;
    const hasComplexTerms = /(paradox|philosophical|quantum|consciousness|metaphysics)/i.test(content);
    const hasTechnicalTerms = /(equation|formula|theorem|algorithm|molecule|atom)/i.test(content);
    
    if (wordCount > 100 || hasComplexTerms || hasTechnicalTerms) return 'complex';
    if (wordCount > 50 || hasTechnicalTerms) return 'medium';
    return 'simple';
  }

  // Select primary symbol for dominant domain
  private selectPrimarySymbol(domain: string, complexity: 'simple' | 'medium' | 'complex'): string {
    const symbols = this.symbolRanges[domain as keyof typeof this.symbolRanges];
    if (!symbols) {
      console.log(`   ⚠️ No symbols found for domain: ${domain}, using default ❖`);
      return '❖'; // Default philosophical symbol
    }
    
    // Select based on complexity level
    const symbolArray = Object.values(symbols).flat();
    const index = complexity === 'complex' ? 0 : complexity === 'medium' ? 2 : 4;
    const selectedSymbol = symbolArray[index % symbolArray.length] || '❖';
    
    console.log(`   🎯 Selected primary symbol: ${selectedSymbol} for domain: ${domain} (complexity: ${complexity})`);
    
    return selectedSymbol;
  }

  // Select secondary symbol for supporting domains
  private selectSecondarySymbol(domain: string, complexity: 'simple' | 'medium' | 'complex'): string {
    const symbols = this.symbolRanges[domain as keyof typeof this.symbolRanges];
    if (!symbols) return '⚛';
    
    const symbolArray = Object.values(symbols).flat();
    const index = complexity === 'complex' ? 1 : complexity === 'medium' ? 3 : 5;
    
    return symbolArray[index % symbolArray.length] || '⚛';
  }

  // Generate contextual symbols based on specific concepts
  public generateContextualSymbols(content: string, count: number): string[] {
    const contextualSymbols: string[] = [];
    const domains = this.detectDomains(content);
    
    // Add domain-specific contextual symbols
    for (const domain of domains.slice(0, Math.min(count, domains.length))) {
      const symbols = this.symbolRanges[domain as keyof typeof this.symbolRanges];
      if (symbols) {
        const symbolArray = Object.values(symbols).flat();
        contextualSymbols.push(symbolArray[Math.floor(Math.random() * symbolArray.length)]);
      }
    }
    
    // Fill remaining slots with random symbols if needed
    while (contextualSymbols.length < count) {
      const allSymbols = this.getAllSymbols();
      contextualSymbols.push(allSymbols[Math.floor(Math.random() * allSymbols.length)]);
    }
    
    return contextualSymbols;
  }

  // Generate emergent symbols through pattern recognition
  public generateEmergentSymbols(content: string, count: number): string[] {
    const emergentSymbols: string[] = [];
    const complexity = this.analyzeComplexity(content);
    
    // Emergent symbols based on content patterns
    if (content.includes('flow') || content.includes('energy')) {
      emergentSymbols.push('∇'); // Gradient for flow
    }
    
    if (content.includes('consciousness') || content.includes('mind')) {
      emergentSymbols.push('❖'); // Diamond for consciousness
    }
    
    if (content.includes('quantum') || content.includes('particle')) {
      emergentSymbols.push('⚛'); // Atom for quantum
    }
    
    if (content.includes('paradox') || content.includes('contradiction')) {
      emergentSymbols.push('Σ'); // Sigma for paradox
    }
    
    if (content.includes('evolution') || content.includes('growth')) {
      emergentSymbols.push('⚜'); // Fleur-de-lis for growth
    }
    
    // Fill remaining slots with random symbols if needed
    while (emergentSymbols.length < count) {
      const allSymbols = this.getAllSymbols();
      emergentSymbols.push(allSymbols[Math.floor(Math.random() * allSymbols.length)]);
    }
    
    return emergentSymbols;
  }

  // Get all available symbols for a specific domain
  getDomainSymbols(domain: string): string[] {
    const symbols = this.symbolRanges[domain as keyof typeof this.symbolRanges];
    if (!symbols) return [];
    
    return Object.values(symbols).flat();
  }

  // Get all available symbols across all domains
  getAllSymbols(): string[] {
    return Object.values(this.symbolRanges).flatMap(domain => 
      Object.values(domain).flat()
    );
  }
}

// Export for use in other modules
export default PureUnicodeGenerator;

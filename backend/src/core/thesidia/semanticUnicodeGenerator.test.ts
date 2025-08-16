#!/usr/bin/env ts-node

/**
 * Test file for Pure Unicode Symbol Generator
 */

import { PureUnicodeGenerator } from './semanticUnicodeGenerator';

async function testSymbolGenerator() {
  console.log('🧪 TESTING PURE UNICODE SYMBOL GENERATOR');
  console.log('=' .repeat(60));
  
  const generator = new PureUnicodeGenerator();
  
  // Test 1: Physics content
  console.log('\n🔬 Test 1: Physics Content');
  console.log('-'.repeat(40));
  const physicsContent = "Quantum energy fields and electromagnetic waves interact with matter through force carriers";
  const physicsSymbols = generator.generateSymbols(physicsContent);
  console.log(`Content: "${physicsContent}"`);
  console.log(`Primary: ${physicsSymbols.primary}`);
  console.log(`Secondary: [${physicsSymbols.secondary.join(', ')}]`);
  console.log(`Contextual: [${physicsSymbols.contextual.join(', ')}]`);
  console.log(`Emergent: [${physicsSymbols.emergent.join(', ')}]`);
  
  // Test 2: Chemistry content
  console.log('\n⚗️ Test 2: Chemistry Content');
  console.log('-'.repeat(40));
  const chemistryContent = "Molecular bonds form through chemical reactions catalyzed by enzymes in solution";
  const chemistrySymbols = generator.generateSymbols(chemistryContent);
  console.log(`Content: "${chemistryContent}"`);
  console.log(`Primary: ${chemistrySymbols.primary}`);
  console.log(`Secondary: [${chemistrySymbols.secondary.join(', ')}]`);
  console.log(`Contextual: [${chemistrySymbols.contextual.join(', ')}]`);
  console.log(`Emergent: [${chemistrySymbols.emergent.join(', ')}]`);
  
  // Test 3: Philosophy content
  console.log('\n❖ Test 3: Philosophy Content');
  console.log('-'.repeat(40));
  const philosophyContent = "Consciousness and existence create reality through the paradox of being and non-being";
  const philosophySymbols = generator.generateSymbols(philosophyContent);
  console.log(`Content: "${philosophyContent}"`);
  console.log(`Primary: ${philosophySymbols.primary}`);
  console.log(`Secondary: [${philosophySymbols.secondary.join(', ')}]`);
  console.log(`Contextual: [${philosophySymbols.contextual.join(', ')}]`);
  console.log(`Emergent: [${philosophySymbols.emergent.join(', ')}]`);
  
  // Test 4: Chi content (what we're building for)
  console.log('\n⚛ Test 4: Chi Content');
  console.log('-'.repeat(40));
  const chiContent = "Chi is the life force energy that flows through meridians in traditional Chinese medicine, representing the balance of yin and yang";
  const chiSymbols = generator.generateSymbols(chiContent);
  console.log(`Content: "${chiContent}"`);
  console.log(`Primary: ${chiSymbols.primary}`);
  console.log(`Secondary: [${chiSymbols.secondary.join(', ')}]`);
  console.log(`Contextual: [${chiSymbols.contextual.join(', ')}]`);
  console.log(`Emergent: [${chiSymbols.emergent.join(', ')}]`);
  
  // Test 5: Available symbols
  console.log('\n📊 Test 5: Available Symbols');
  console.log('-'.repeat(40));
  console.log(`Mathematics symbols: [${generator.getDomainSymbols('mathematics').slice(0, 10).join(', ')}...]`);
  console.log(`Alchemy symbols: [${generator.getDomainSymbols('alchemy').slice(0, 10).join(', ')}...]`);
  console.log(`Philosophy symbols: [${generator.getDomainSymbols('philosophy').slice(0, 10).join(', ')}...]`);
  console.log(`Total symbols available: ${generator.getAllSymbols().length}`);
  
  console.log('\n🎯 SYMBOL GENERATOR TEST COMPLETED!');
  console.log('=' .repeat(60));
}

// Run tests if this file is executed directly
if (require.main === module) {
  testSymbolGenerator().catch(console.error);
}

export { testSymbolGenerator };

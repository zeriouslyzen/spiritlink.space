#!/usr/bin/env ts-node

/**
 * Test file for Multi-Lens Processor
 */

import { MultiLensProcessor } from './multiLensProcessor';

async function testMultiLensProcessor() {
  console.log('🧪 TESTING MULTI-LENS PROCESSOR');
  console.log('=' .repeat(60));
  
  const processor = new MultiLensProcessor();
  
  // Test with the chi prompt
  const chiPrompt = "What is chi?";
  console.log(`\n🎯 Testing with prompt: "${chiPrompt}"`);
  console.log('-'.repeat(50));
  
  try {
    const unifiedKnowledge = await processor.processThroughAllLenses(chiPrompt);
    
    console.log('\n🎯 UNIFIED KNOWLEDGE RESULTS:');
    console.log('=' .repeat(50));
    
    console.log(`\n🔤 Primary Symbols: [${unifiedKnowledge.primarySymbols.join(', ')}]`);
    console.log(`\n💡 Emergent Insights:`);
    unifiedKnowledge.emergentInsights.forEach((insight, index) => {
      console.log(`   ${index + 1}. ${insight}`);
    });
    
    console.log(`\n🔗 Cross-Lens Connections:`);
    unifiedKnowledge.crossLensConnections.forEach((connection, index) => {
      console.log(`   ${index + 1}. ${connection}`);
    });
    
    console.log(`\n🛤️ Deeper Exploration Paths:`);
    unifiedKnowledge.deeperExplorationPaths.forEach((path, index) => {
      console.log(`   ${index + 1}. ${path}`);
    });
    
    console.log(`\n🔮 Unified Symbolic Language:`);
    console.log(`   ${unifiedKnowledge.unifiedSymbolicLanguage}`);
    
    console.log('\n🎉 MULTI-LENS PROCESSOR TEST COMPLETED!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Multi-Lens Processor test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testMultiLensProcessor().catch(console.error);
}

export { testMultiLensProcessor };

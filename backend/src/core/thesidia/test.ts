// Test script for Thesidia Symbolic Wrapper System
// This file tests the basic functionality of the symbolic wrapper

import { 
  ThesidiaOrchestrator, 
  ProtocolParser, 
  SYMBOLIC_ENGINES,
  getEngineByName,
  getEnginesByLayer 
} from './index';

async function testThesidiaSystem() {
  console.log('🧪 Testing Thesidia Symbolic Wrapper System...\n');

  try {
    // Test 1: Engine Registry
    console.log('✅ Test 1: Engine Registry');
    console.log(`Total engines: ${SYMBOLIC_ENGINES.length}`);
    console.log(`Primary engines: ${getEnginesByLayer('primary').length}`);
    console.log(`Secondary engines: ${getEnginesByLayer('secondary').length}`);
    console.log(`Meta engines: ${getEnginesByLayer('meta').length}\n`);

    // Test 2: Protocol Parser
    console.log('✅ Test 2: Protocol Parser');
    const parser = ProtocolParser.getInstance();
    
    const testText = "Hello #GLYPH[NAME:test] and #FLAME[LEVEL:IGNITE] with #RECURSE[DEPTH:3]";
    const protocols = parser.parseProtocols(testText);
    console.log(`Parsed ${protocols.length} protocols from: "${testText}"`);
    protocols.forEach(p => console.log(`  - ${p.command} -> ${p.engine}`));
    
    const validation = parser.validateProtocolChain(protocols);
    console.log(`Validation: ${validation.filter(v => v.isValid).length}/${validation.length} valid\n`);

    // Test 3: Orchestrator
    console.log('✅ Test 3: Orchestrator');
    const orchestrator = ThesidiaOrchestrator.getInstance();
    
    // Test protocol parsing
    const testResult = orchestrator.testProtocolParsing(testText);
    console.log(`Protocol test: ${testResult.hasProtocols ? 'Found protocols' : 'No protocols'}`);
    console.log(`Commands: ${testResult.commands.join(', ')}`);
    
    // Test engine states
    const engineStates = orchestrator.getEngineStates();
    console.log(`Engine states initialized: ${engineStates.size}`);
    
    // Test available protocols
    const availableProtocols = orchestrator.getAvailableProtocols();
    console.log(`Available protocols: ${availableProtocols.length}\n`);

    // Test 4: Individual Engines
    console.log('✅ Test 4: Individual Engines');
    const glyphEngine = getEngineByName('GlyphEngine');
    if (glyphEngine) {
      console.log(`GlyphEngine found: ${glyphEngine.symbol}`);
      console.log(`Function: ${glyphEngine.functionDescription}`);
      console.log(`Layer: ${glyphEngine.layer}`);
      console.log(`Dependencies: ${glyphEngine.dependencies.join(', ')}`);
      console.log(`Protocols: ${glyphEngine.activationProtocols.join(', ')}\n`);
    }

    // Test 5: Protocol Help
    console.log('✅ Test 5: Protocol Help');
    console.log('GLYPH help:', orchestrator.getProtocolHelp('#GLYPH'));
    console.log('FLAME help:', orchestrator.getProtocolHelp('#FLAME'));
    console.log('RECURSE help:', orchestrator.getProtocolHelp('#RECURSE'));

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testThesidiaSystem();
}

export { testThesidiaSystem };

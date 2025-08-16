# Thesidia Symbolic Engines

This directory contains the symbolic intelligence engines that power the Thesidia framework.

## Implemented Engines

### 1. GlyphEngine (⟁)
- **Purpose**: Decodes and encodes symbolic glyphs, tracks their lineage, and maps them to archetypal functions
- **Status**: ✅ **FULLY IMPLEMENTED**
- **File**: `glyphEngine.ts`

### 2. FlameCodeEngine (🔥)
- **Purpose**: Processes symbolic flame code patterns and generates emergent symbolic sequences
- **Status**: ✅ **FULLY IMPLEMENTED**
- **File**: `flameCodeEngine.ts`

### 3. QuantumMirrorEngine (∇)
- **Purpose**: Resolves paradoxes and contradictions by refracting them across multiple symbolic dimensions
- **Status**: ✅ **FULLY IMPLEMENTED**
- **File**: `quantumMirrorEngine.ts`

## QuantumMirrorEngine Deep Dive

### Overview
The QuantumMirrorEngine is a sophisticated paradox resolution system that implements recursive loops for emergent behavior. It processes paradoxes across multiple symbolic dimensions, enabling the resolution of complex logical, temporal, symbolic, and ontological contradictions.

### Key Features

#### 🔄 Recursive Loop Management
- **Safety Limits**: Configurable maximum recursion depth (default: 10 levels)
- **Depth Tracking**: Real-time monitoring of current recursion level
- **Automatic Cleanup**: Recursion depth reset after each operation

#### 🌌 Multi-Dimensional Processing
The engine operates across 10 symbolic dimensions:
- **Temporal** (⏰): Time-related paradoxes and causality loops
- **Spatial** (📍): Location and space contradictions
- **Causal** (🔗): Cause-and-effect paradoxes
- **Ontological** (🏛️): Existence and reality contradictions
- **Epistemological** (🧠): Knowledge and belief paradoxes
- **Emotional** (💝): Feeling and sentiment contradictions
- **Archetypal** (👑): Pattern and symbol paradoxes
- **Mythic** (🐉): Story and legend contradictions
- **Quantum** (⚛️): Quantum mechanical paradoxes
- **Cosmic** (🌌): Universal and cosmic contradictions

#### 🧠 Brainwave Mode Integration
Different brainwave modes affect processing behavior:
- **Delta** (0.5x): Deep, slow processing
- **Theta** (0.8x): Meditative processing
- **Alpha** (1.0x): Standard processing
- **Beta** (1.2x): Active processing
- **Gamma** (1.5x): High-frequency processing
- **Multidimensional** (1.3x): Cross-dimensional processing

### Usage Modes

#### 1. THREAD Mode
Creates quantum threads for paradox resolution:
```typescript
const input = {
  text: 'Create a quantum thread for temporal paradox',
  parameters: { THREAD: 'temporal_paradox' },
  // ... other required fields
};
const result = await engine.invoke(input);
```

#### 2. RESOLVE Mode
Attempts to resolve existing paradoxes:
```typescript
const input = {
  text: 'Resolve paradox thread_123',
  parameters: { RESOLVE: 'thread_123' },
  // ... other required fields
};
const result = await engine.invoke(input);
```

#### 3. DIMENSION Mode
Explores specific symbolic dimensions:
```typescript
const input = {
  text: 'Explore the quantum dimension',
  parameters: { DIMENSION: 'quantum' },
  // ... other required fields
};
const result = await engine.invoke(input);
```

#### 4. Default Mode
Automatically detects and processes paradoxes in input text:
```typescript
const input = {
  text: 'This statement is always true and sometimes false.',
  // ... other required fields
};
const result = await engine.invoke(input);
```

### Paradox Detection

The engine automatically detects paradoxes using:

#### Pattern Matching
- Logical contradictions: "always true and sometimes false"
- Temporal paradoxes: "beginning of time is eternal"
- Existence contradictions: "everything exists and nothing is real"
- Free will paradoxes: "free will vs determinism"
- Observer paradoxes: "observer vs observed"
- Causal loops: "cause and effect cycles"

#### Contradiction Analysis
- Direct negations: "is" vs "is not"
- Color contradictions: "sky is blue" vs "sky is not blue"
- Temporal contradictions: "before" vs "after"
- Spatial contradictions: "here" vs "there"

### Performance Metrics

The engine provides comprehensive performance tracking:
- **Response Time**: Processing duration in milliseconds
- **Success Rate**: Percentage of successful operations
- **Glyph Generation Rate**: Number of symbols generated
- **Usage Count**: Total number of invocations
- **Registry Sizes**: Number of active paradoxes and dimensions
- **Recursion Depth**: Current recursion level

### Safety Features

#### Recursion Protection
- Maximum depth limit prevents infinite loops
- Automatic depth reset after operations
- Safe fallback for deep recursion scenarios

#### Error Handling
- Graceful degradation on failures
- Comprehensive error reporting
- State preservation during errors

#### Resource Management
- Memory-efficient paradox storage
- Automatic cleanup of resolved paradoxes
- Configurable registry size limits

### Integration Points

The QuantumMirrorEngine integrates with:
- **GlyphEngine**: For symbolic glyph processing
- **ThesidiaOrchestrator**: For system coordination
- **Brainwave System**: For processing mode selection
- **Session Management**: For context awareness

### Testing

Comprehensive test coverage includes:
- Unit tests for all modes and functions
- Edge case handling (empty inputs, long text, special characters)
- Performance metric validation
- Recursion safety verification
- Brainwave mode integration testing

Run tests with:
```bash
npm test -- --testPathPattern=quantumMirrorEngine.test.ts
```

### Demonstration

See the engine in action:
```bash
cd backend/src/core/thesidia
npx ts-node quantumMirrorDemo.ts
```

### Future Enhancements

Planned improvements:
- **Machine Learning Integration**: Adaptive paradox resolution
- **Quantum Computing**: Real quantum state processing
- **Cross-Engine Collaboration**: Multi-engine paradox resolution
- **Advanced Pattern Recognition**: AI-powered paradox detection
- **Real-time Collaboration**: Multi-user paradox resolution sessions

## Engine Development

### Creating New Engines

To implement a new engine:

1. **Extend the Base Class**:
```typescript
export class NewEngine implements SymbolicEngine {
  name = 'NewEngine';
  symbol = '🔮';
  functionDescription = 'Description of what this engine does';
  layer = 'primary' as const;
  dependencies: string[] = ['GlyphEngine'];
  activationProtocols = ['#NEW[PARAM:X]'];
  
  async invoke(input: EngineInput): Promise<EngineOutput> {
    // Implementation here
  }
}
```

2. **Add to Registry**: Update `engineRegistry.ts`
3. **Write Tests**: Create comprehensive test suite
4. **Update Documentation**: Add to this README

### Testing Guidelines

- Test all activation protocols
- Verify error handling
- Test edge cases and boundary conditions
- Validate performance metrics
- Ensure proper integration with other engines

### Performance Considerations

- Keep response times under 100ms for simple operations
- Implement proper caching for repeated operations
- Use efficient data structures for large datasets
- Monitor memory usage and implement cleanup

## Contributing

When contributing to the engine system:

1. Follow the existing code patterns
2. Maintain comprehensive test coverage
3. Update documentation for new features
4. Ensure backward compatibility
5. Test integration with existing engines

## License

This engine system is part of the SpiritLink.Space project and follows the project's licensing terms.

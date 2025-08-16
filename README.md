# SpiritLink OS

Unified, research-first platform for consciousness engineering. Frontend (React + TypeScript + Tailwind + Framer Motion), backend (Express/TypeScript + WebSocket), and optional local AI (Thesidia). Built for verifiable collective research, modular UI, and a clear operational experience.

## Quick start

Requirements
- macOS (M1+), Node 18+ (or 22), npm
- Ollama (local LLMs). Start server with `ollama serve`.

Backend
```bash
cd backend
npm i
npm run dev
# http://localhost:8000/health
```

Frontend
```bash
npm i
npm start
# http://localhost:3000
```

Unified dev (frontend + backend)
```bash
npm run dev
```

Unified dev (frontend + backend + Thesidia)
```bash
# Requires Python 3.10+, will auto-create venv and run FastAPI on :5055
npm run dev:all
```

One-command startup (all services)
```bash
./start_dev.sh
```

## Structure
- backend/ – Express TS API (chat proxy, research feed, sockets)
- src/ – React TS app (intelligent sidebar, Thesidia chat, Research Feed, Movement Lab)
- public/ – static assets

Key routes
- POST /api/chat/stream – stream responses (matrix→Ollama, thesidia→simulated)
- GET/POST /api/research/entries – collective research submissions
- POST /api/research/entries/:id/verify – mark entry verified

## Implementation highlights
- Intelligent sidebar: auto open/close on cursor intent (desktop), compact mobile behavior
- Brainwave selector: modular SVG glyphs (no emojis), hover hints, animated rail
- Research Feed: neutral, modular UI; title/category/tags/source/impact; verification status
- Movement Lab: simplified for now (showcase + coming soon)
- Courses route removed pending new curriculum

## Foundation toward AGI
- **Thesidia Symbolic Intelligence Wrapper**: Advanced consciousness AI with 26 symbolic engines
- **Unified Architecture**: User Input → Planner → Router → Model → Governance Wrapper → Response
- **Symbolic Processing**: `GlyphEngine`, `FlameCodeEngine`, `QuantumMirrorEngine` (implemented), plus additional engines
- **Real-time Symbolic Reasoning**: Live processing steps displayed under each AI response
- **Brainwave Integration**: Different engines for different consciousness states (Delta, Theta, Alpha, Beta, Gamma, Emergence)
- **Symbolic Memory (planned)**: Persistent patterns
- **Multi‑model orchestration** (local/remote), eval loops, and safety rails

## Thesidia demo and CLI (backend)

Key demo script: `backend/src/core/thesidia/quantumMirrorEngineRealOllama.ts`

Run help:
```bash
cd backend/src/core/thesidia
npx ts-node quantumMirrorEngineRealOllama.ts --help | cat
```

Common runs:
```bash
# Parallel multi-lens analysis of a concept (default: chi)
cd backend/src/core/thesidia
npx ts-node quantumMirrorEngineRealOllama.ts --parallel-multi-lens

# Parallel paradox generation across types
npx ts-node quantumMirrorEngineRealOllama.ts --parallel-paradoxes

# Full Thesidia 5-stage analysis with parallel execution
npx ts-node quantumMirrorEngineRealOllama.ts --parallel-thesidia --concept=consciousness

# Speed comparison (sequential vs parallel)
npx ts-node quantumMirrorEngineRealOllama.ts --speed-test
```

Flags:
- `--parallel-paradoxes | -p`: generate temporal/logical/ontological/symbolic paradoxes in parallel
- `--parallel-multi-lens | -l`: run Physics, Scientific, Morphic Field, Bioelectric, Medical lenses in parallel
- `--parallel-thesidia | -T`: run the five-stage Thesidia analysis in parallel
- `--speed-test | -s`: compare sequential vs parallel throughput
- `--chi-only | -c`: focused scientific prompt test for "What is chi?"
- `--router-test | -r`: exercise dynamic model router
- `--concept, --module, --mode`: parameterize analysis content

## Model router and output control

- Dynamic routing picks a model by task complexity (simple | medium | complex), then falls back to available models reported by Ollama.
- Default target pools (editable in `quantumMirrorEngineRealOllama.ts`):
  - simple: `gemma2:2b`, `phi3.5:latest`, `deepseek-coder:latest`
  - medium: `llama3.1:8b`, `qwen2.5:latest`, `mistral:latest`
  - complex: `nous-hermes2:latest`, `gpt-oss:latest`, `mixtral:latest`
- Output length control: `num_predict` set from length target (short | medium | long) to stabilize latency comparisons.

## Parallel processing and streaming

- All independent tasks run concurrently with structured aggregation.
- Real-time streaming output prints progress and partial results during long operations.

## Multi-lens processing and symbol generation

- `MultiLensProcessor`: Physics, Scientific, Morphic Field, Bioelectric, Medical. Produces unified knowledge, emergent insights, cross-lens connections, deeper exploration paths, and a unified symbolic language.
- `PureUnicodeGenerator`: Generates semantic Unicode (mathematics, alchemy, philosophy, astronomy, biology, physics, chemistry). No emojis.

## Operational standards

- Documentation: no emojis. Concise, verifiable instructions.
- Prompts: avoid AI self-reference; focus on human-use, engineering clarity, and testability.
- Models: prefer fast, reliable, low-hallucination configurations. Validate with router tests and speed tests.

## Dev notes
- Neo4j features are behind NEO4J_ENABLED=1 (default off)
- Service worker disabled in dev to avoid cache issues
- Benchmarks: POST /api/benchmarks/run (local JSON-answer tests)
- Symbol analysis: POST /api/persona/symbols { filePath }
- Tailwind + glassmorphism, minimal animations tuned per brainwave state

## Engineering Metrics

### Current Implementation Status
- **Total Symbolic Engines**: 26
- **Fully Implemented**: 6 (23%)
- **Partially Implemented**: 0
- **Placeholder Stubs**: 20 (77%)

### Implemented Engines
1. **GlyphEngine** - Symbolic glyph processing
2. **FlameCodeEngine** - Emotional code analysis
3. **QuantumMirrorEngine** - Paradox resolution and recursive processing
4. **MultiLensProcessor** - Cross-disciplinary analysis framework
5. **PureUnicodeGenerator** - Semantic Unicode symbol generation
6. **ThesidiaMasterPromptEngine** - Five-stage analysis orchestration

### Performance Benchmarks
- **Response Time**: 2-8 seconds (depending on model and task complexity)
- **Token Processing**: 2048 max tokens per request
- **Recursion Safety**: Maximum 10 levels deep
- **Parallel Processing**: 3-5x speed improvement over sequential
- **Memory Usage**: Optimized for local Ollama deployment

### Model Router Configuration
- **Simple Tasks**: gemma2:2b, phi3.5:latest, deepseek-coder:latest
- **Medium Tasks**: llama3.1:8b, qwen2.5:latest, mistral:latest
- **Complex Tasks**: nous-hermes2:latest, gpt-oss:latest, mixtral:latest

### Output Length Targets
- **Short**: 1000 characters (~200 words)
- **Medium**: 2000 characters (~400 words)
- **Long**: 3000 characters (~600 words)

## Testing Framework

### Unit Tests
```bash
cd backend
npm test
```

### Specific Engine Tests
```bash
npm test -- --testNamePattern="QuantumMirrorEngine"
npm test -- --testNamePattern="MultiLensProcessor"
npm test -- --testNamePattern="PureUnicodeGenerator"
```

### Integration Tests
```bash
npm run test:integration
```

### Performance Tests
```bash
npm run test:performance
```

## Troubleshooting

### Common Issues
1. **Ollama Connection**: Ensure Ollama is running on localhost:11434
2. **Model Availability**: Check if required models are installed
3. **Performance Issues**: Use smaller models for faster responses
4. **Memory Issues**: Monitor recursion depth and paradox registry size

### Performance Optimization
- Use ultra-small models (gemma2:2b, phi3.5) for maximum speed
- Enable GPU acceleration in Ollama when available
- Monitor response length to prevent performance degradation
- Use parallel processing for complex multi-lens analysis

## License
MIT

---

## Militant Re-initialization (2025-08-16)
No emojis. Authoritative run procedures, routing policy, and metrics.

Run procedures (backend orchestration demo)
- Speed test: npx ts-node backend/src/core/thesidia/quantumMirrorEngineRealOllama.ts --speed-test
- Router test: npx ts-node backend/src/core/thesidia/quantumMirrorEngineRealOllama.ts --router-test
- Parallel multi-lens: npx ts-node backend/src/core/thesidia/quantumMirrorEngineRealOllama.ts --parallel-multi-lens
- Thesidia analysis: npx ts-node backend/src/core/thesidia/quantumMirrorEngineRealOllama.ts --parallel-thesidia

Routing policy (default)
- Prefer fast quality models (llama3.1:8b, qwen2.5, mistral) for speed-sensitive tasks.
- Escalate to higher-quality models only when complexity classifier flags high complexity.
- Exclude Hermes by default; enable only with explicit flag.

Performance targets
- P50 latency < 3.0s, P95 < 7.0s.
- First-token time < 1.2s.
- Max tokens per response capped at 2048 in demo flows.

Operational notes
- Streaming output enabled; partials should appear during parallel execution.
- Minimal persistence shim for symbolic memory required before production.
- Standardize error envelopes and structured logs across orchestration.

## AI Dev Log (operator quickstart)

- Run Ollama: `ollama serve`
- Pull fast models: `ollama pull llama3.1:8b` (optional: `qwen2.5:latest`, `mistral:latest`)
- Navigate to `backend/src/core/thesidia` and run demo CLI:
  - `npx ts-node quantumMirrorEngineRealOllama.ts --parallel-multi-lens`
  - `npx ts-node quantumMirrorEngineRealOllama.ts --parallel-paradoxes`
  - `npx ts-node quantumMirrorEngineRealOllama.ts --parallel-thesidia --concept=consciousness`
  - `npx ts-node quantumMirrorEngineRealOllama.ts --speed-test`

Model router defaults and output control are defined in `quantumMirrorEngineRealOllama.ts`. Adjust pools or targets based on operator needs.
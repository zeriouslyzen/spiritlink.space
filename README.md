# SpiritLink OS

Unified, research-first platform for consciousness engineering. Frontend (React + TypeScript + Tailwind + Framer Motion), backend (Express/TypeScript + WebSocket), and optional local AI (Thesidia/FastAPI). Built for verifiable collective research, modular UI, and a neuro‑aesthetic experience.

## Quick start

Requirements
- macOS (M1+), Node 18+ (or 22), npm
- Optional: Python 3.10+ (Thesidia), Ollama (local LLMs)

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
- Neuro‑Symbolic HAG wrapper around LLM outputs (verification/governance passes)
- Verified research → Knowledge Graph (future) → retrieval for planning/grounding
- Multi‑model orchestration (local/remote), eval loops, and safety rails

## Dev notes
- Neo4j features are behind NEO4J_ENABLED=1 (default off)
- Service worker disabled in dev to avoid cache issues
- Tailwind + glassmorphism, minimal animations tuned per brainwave state

## License
MIT
#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
CONC_DIR="${ROOT_DIR%/spiritlink.space}/Concioiusness"

echo "🔧 Starting SpiritLink OS (frontend + backend + Thesidia)"

# Backend env
if [ ! -f "$BACKEND_DIR/.env" ]; then
  cp "$BACKEND_DIR/env.example" "$BACKEND_DIR/.env" || true
fi

# Backend (nodemon)
echo "🚀 Backend (8000)"
nohup bash -lc "cd '$BACKEND_DIR' && npm run dev" > "$BACKEND_DIR/backend-dev.log" 2>&1 &

# Frontend (CRA)
echo "🌐 Frontend (3000)"
nohup bash -lc "cd '$ROOT_DIR' && npm start" > "$ROOT_DIR/frontend-dev.log" 2>&1 &

# Thesidia (FastAPI)
if [ -d "$CONC_DIR" ]; then
  echo "🧠 Thesidia (5055)"
  nohup bash -lc "cd '$CONC_DIR' && (python3.11 -m venv thesidia_env || true) && . thesidia_env/bin/activate && python -m pip -q install --upgrade pip setuptools wheel && python -m pip -q install fastapi uvicorn && python -m pip -q install -r requirements.txt || true && uvicorn api:app --host 127.0.0.1 --port 5055 --reload" > "$ROOT_DIR/thesidia-dev.log" 2>&1 &
else
  echo "⚠️ Thesidia folder not found at: $CONC_DIR"
fi

sleep 2

echo "✅ Health checks"
echo -n "Backend: "; curl -sS http://localhost:8000/health | head -c 120; echo
echo -n "Thesidia: "; (curl -sS http://127.0.0.1:5055/health | head -c 120 || true); echo
echo "Open: http://localhost:3000"



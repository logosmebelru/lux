#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/.preview.pid"
LOG_FILE="$ROOT_DIR/.preview.log"
PORT_FILE="$ROOT_DIR/.preview.port"
PORT="${PORT:-4184}"

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "preview already running with PID $(cat "$PID_FILE") on port ${PORT}"
  exit 0
fi

if [[ ! -d "$ROOT_DIR/dist" ]]; then
  echo "dist is missing, running build first..."
  (cd "$ROOT_DIR" && npm run build)
fi

setsid env PORT="$PORT" node "$ROOT_DIR/scripts/serve-dist.mjs" >"$LOG_FILE" 2>&1 < /dev/null &
PREVIEW_PID=$!
echo "$PREVIEW_PID" > "$PID_FILE"
echo "$PORT" > "$PORT_FILE"

for _ in {1..15}; do
  if curl -fsS "http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! kill -0 "$PREVIEW_PID" 2>/dev/null || ! curl -fsS "http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  rm -f "$PID_FILE" "$PORT_FILE"
  echo "failed to start preview, see $LOG_FILE"
  exit 1
fi

echo "greenmont preview started with PID $PREVIEW_PID"
echo "local: http://127.0.0.1:$PORT"
echo "log: $LOG_FILE"

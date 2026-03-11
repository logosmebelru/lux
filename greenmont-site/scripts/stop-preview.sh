#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/.preview.pid"
PORT_FILE="$ROOT_DIR/.preview.port"

if [[ ! -f "$PID_FILE" ]]; then
  echo "preview is not running"
  exit 0
fi

PREVIEW_PID="$(cat "$PID_FILE")"

if kill -0 "$PREVIEW_PID" 2>/dev/null; then
  kill "$PREVIEW_PID"
  echo "stopped greenmont preview PID $PREVIEW_PID"
else
  echo "stale PID file found, removing"
fi

rm -f "$PID_FILE" "$PORT_FILE"

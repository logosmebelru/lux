#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TUNNEL_PID_FILE="$ROOT_DIR/.cloudflared.pid"
PUBLIC_URL_FILE="$ROOT_DIR/.public-url"

if [[ ! -f "$TUNNEL_PID_FILE" ]]; then
  echo "public preview is not running"
  exit 0
fi

TUNNEL_PID="$(cat "$TUNNEL_PID_FILE")"

if kill -0 "$TUNNEL_PID" 2>/dev/null; then
  kill "$TUNNEL_PID"
  echo "stopped cloudflared PID $TUNNEL_PID"
else
  echo "stale cloudflared PID file found, removing"
fi

rm -f "$TUNNEL_PID_FILE" "$PUBLIC_URL_FILE"

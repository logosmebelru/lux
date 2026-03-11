#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TUNNEL_PID_FILE="$ROOT_DIR/.cloudflared.pid"
PUBLIC_URL_FILE="$ROOT_DIR/.public-url"

if [[ -f "$TUNNEL_PID_FILE" ]] && kill -0 "$(cat "$TUNNEL_PID_FILE")" 2>/dev/null; then
  echo "public-status: running"
  echo "public-pid: $(cat "$TUNNEL_PID_FILE")"
else
  echo "public-status: not running"
fi

if [[ -f "$PUBLIC_URL_FILE" ]]; then
  echo "public-url: $(cat "$PUBLIC_URL_FILE")"
fi

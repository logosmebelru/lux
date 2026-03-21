#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TUNNEL_PID_FILE="$ROOT_DIR/.cloudflared.pid"
PUBLIC_URL_FILE="$ROOT_DIR/.public-url"

"$ROOT_DIR/scripts/stop-preview.sh"
rm -f "$TUNNEL_PID_FILE" "$PUBLIC_URL_FILE"

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PREVIEW_PORT_FILE="$ROOT_DIR/.preview.port"
TUNNEL_PID_FILE="$ROOT_DIR/.cloudflared.pid"
TUNNEL_LOG_FILE="$ROOT_DIR/.cloudflared.log"
PUBLIC_URL_FILE="$ROOT_DIR/.public-url"
PORT="${PORT:-$(cat "$PREVIEW_PORT_FILE" 2>/dev/null || echo 4184)}"

"$ROOT_DIR/scripts/start-preview.sh"

if [[ -f "$TUNNEL_PID_FILE" ]] && kill -0 "$(cat "$TUNNEL_PID_FILE")" 2>/dev/null; then
  echo "cloudflared already running with PID $(cat "$TUNNEL_PID_FILE")"
  if [[ -f "$PUBLIC_URL_FILE" ]]; then
    echo "public: $(cat "$PUBLIC_URL_FILE")"
  fi
  exit 0
fi

rm -f "$PUBLIC_URL_FILE" "$TUNNEL_LOG_FILE"
setsid cloudflared tunnel --no-autoupdate --url "http://127.0.0.1:$PORT" >"$TUNNEL_LOG_FILE" 2>&1 < /dev/null &
TUNNEL_PID=$!
echo "$TUNNEL_PID" > "$TUNNEL_PID_FILE"

PUBLIC_URL=""
for _ in {1..30}; do
  if [[ -f "$TUNNEL_LOG_FILE" ]]; then
    PUBLIC_URL="$(grep -o 'https://[-A-Za-z0-9.]*trycloudflare.com' "$TUNNEL_LOG_FILE" | head -n 1 || true)"
  fi
  if [[ -n "$PUBLIC_URL" ]]; then
    break
  fi
  sleep 1
done

if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
  rm -f "$TUNNEL_PID_FILE"
  echo "cloudflared exited unexpectedly, see $TUNNEL_LOG_FILE"
  exit 1
fi

if [[ -z "$PUBLIC_URL" ]]; then
  echo "failed to extract public URL, see $TUNNEL_LOG_FILE"
  exit 1
fi

echo "$PUBLIC_URL" > "$PUBLIC_URL_FILE"
echo "public preview ready:"
echo "$PUBLIC_URL"

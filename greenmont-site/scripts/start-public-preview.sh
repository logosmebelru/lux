#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PREVIEW_PORT_FILE="$ROOT_DIR/.preview.port"
PORT="${PORT:-$(cat "$PREVIEW_PORT_FILE" 2>/dev/null || echo 4184)}"
PUBLIC_IP=""

"$ROOT_DIR/scripts/start-preview.sh"

TOKEN="$(curl -s -X PUT 'http://169.254.169.254/latest/api/token' -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' || true)"
if [[ -n "$TOKEN" ]]; then
  PUBLIC_IP="$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4 || true)"
fi

if [[ -f "$PREVIEW_PORT_FILE" ]]; then
  PORT="$(cat "$PREVIEW_PORT_FILE")"
fi

echo "public preview ready:"
if [[ -n "$PUBLIC_IP" ]]; then
  echo "http://$PUBLIC_IP:$PORT"
else
  echo "http://127.0.0.1:$PORT"
fi

#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$ROOT_DIR/.preview.pid"
PORT_FILE="$ROOT_DIR/.preview.port"
PORT="$(cat "$PORT_FILE" 2>/dev/null || echo 4184)"
PRIVATE_IP="$(hostname -I | awk '{print $1}')"
PUBLIC_IP=""

TOKEN="$(curl -s -X PUT 'http://169.254.169.254/latest/api/token' -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' || true)"
if [[ -n "$TOKEN" ]]; then
  PUBLIC_IP="$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4 || true)"
fi

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "public-status: running"
  echo "public-pid: $(cat "$PID_FILE")"
else
  echo "public-status: not running"
fi

echo "local:   http://127.0.0.1:$PORT"
if [[ -n "$PRIVATE_IP" ]]; then
  echo "private: http://$PRIVATE_IP:$PORT"
fi
if [[ -n "$PUBLIC_IP" ]]; then
  echo "public:  http://$PUBLIC_IP:$PORT"
fi
echo "health:  http://127.0.0.1:$PORT/health"

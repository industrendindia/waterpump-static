#!/usr/bin/env bash
set -euo pipefail

app_root=/srv/waterpump-static/app
service_name=waterpump-static.service
port="${1:-}"

if [[ ! "$port" =~ ^[0-9]+$ ]] || (( port < 1024 || port > 65535 )); then
  echo "Usage: sudo bash deploy/install-waterpump-static.sh <unused-port>" >&2
  exit 64
fi

if ss -H -ltn "sport = :$port" | grep -q .; then
  echo "Refusing deployment: TCP port $port is already in use." >&2
  exit 73
fi

if systemctl list-unit-files --type=service --no-legend | awk '{print $1}' | grep -qx "$service_name"; then
  echo "Refusing first-time install: $service_name already exists." >&2
  exit 73
fi

if [[ "$(pwd -P)" != "$app_root" ]]; then
  echo "Run this installer from $app_root." >&2
  exit 64
fi

id -u waterpump >/dev/null 2>&1 || useradd --system --home-dir /srv/waterpump-static --shell /usr/sbin/nologin waterpump
install -d -o waterpump -g waterpump /srv/waterpump-static/runtime

corepack enable
chown -R waterpump:waterpump /srv/waterpump-static
sudo -u waterpump env HOME=/srv/waterpump-static corepack pnpm install --frozen-lockfile
sudo -u waterpump env HOME=/srv/waterpump-static corepack pnpm build
test -f dist/server/index.js

sed "s/__WATERPUMP_PORT__/$port/g" deploy/waterpump-static.service.template > /etc/systemd/system/$service_name
systemctl daemon-reload
systemctl enable --now "$service_name"

sleep 2
curl --fail --silent --show-error "http://127.0.0.1:$port/" >/dev/null
echo "PASS: waterpump-static is isolated on TCP port $port"

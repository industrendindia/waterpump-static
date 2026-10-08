#!/usr/bin/env bash
set -euo pipefail

app_root=/srv/waterpump-static/app
tools_root=/srv/waterpump-static/tools
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

command -v node >/dev/null 2>&1 || {
  echo "Node.js is required (version 22 or newer)." >&2
  exit 69
}
command -v npm >/dev/null 2>&1 || {
  echo "npm is required to bootstrap the isolated pnpm executable." >&2
  exit 69
}
node_major="$(node -p 'Number(process.versions.node.split(".")[0])')"
if (( node_major < 22 )); then
  echo "Node.js 22 or newer is required; found $(node --version)." >&2
  exit 69
fi

id -u waterpump >/dev/null 2>&1 || useradd --system --home-dir /srv/waterpump-static --shell /usr/sbin/nologin waterpump
install -d -o waterpump -g waterpump \
  /srv/waterpump-static/runtime \
  /srv/waterpump-static/runtime/home \
  /srv/waterpump-static/runtime/config \
  "$tools_root"

chown -R waterpump:waterpump /srv/waterpump-static
sudo -u waterpump env HOME=/srv/waterpump-static npm install \
  --prefix "$tools_root" --no-save --no-package-lock --no-audit --no-fund pnpm@11.25.0
pnpm_bin="$tools_root/node_modules/.bin/pnpm"
sudo -u waterpump env HOME=/srv/waterpump-static "$pnpm_bin" install --frozen-lockfile
sudo -u waterpump env HOME=/srv/waterpump-static "$pnpm_bin" build
test -f dist/server/index.js
install -d -o waterpump -g waterpump "$app_root/dist/server/.wrangler"

sed "s/__WATERPUMP_PORT__/$port/g" deploy/waterpump-static.service.template > /etc/systemd/system/$service_name
systemctl daemon-reload
systemctl enable --now "$service_name"

sleep 2
curl --fail --silent --show-error --connect-timeout 5 --max-time 15 \
  "http://127.0.0.1:$port/" >/dev/null
echo "PASS: waterpump-static is isolated on TCP port $port"

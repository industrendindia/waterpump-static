# VPS deployment

This deployment is isolated from the existing Industrend, Repairhub, inventory, and Java services.

- Dedicated directory: `/srv/waterpump-static/app`
- Dedicated Linux user: `waterpump`
- Dedicated systemd unit: `waterpump-static.service`
- Dedicated temporary listener: `0.0.0.0:<selected-unused-port>` for IP-based testing
- Dedicated runtime state: `/srv/waterpump-static/runtime`

Before installation, inspect occupied ports with `sudo ss -ltnp`. Select an unused port and run:

```bash
cd /srv/waterpump-static/app
sudo bash deploy/install-waterpump-static.sh <unused-port>
```

The installer aborts if the chosen port or service name is already in use. Restrict the temporary port in the VPS firewall if needed. When the domain is ready, connect it through a separate reverse-proxy virtual host and change `WATERPUMP_HOST` to `127.0.0.1`.

The host must provide Node.js 22 or newer and npm. The installer bootstraps its
exact pnpm version under `/srv/waterpump-static/tools`; it does not install or
replace a global pnpm/Corepack executable.

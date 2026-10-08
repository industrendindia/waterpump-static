import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const rawPort = process.env.WATERPUMP_PORT ?? "";
const port = Number(rawPort);
const host = process.env.WATERPUMP_HOST ?? "127.0.0.1";

if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error("WATERPUMP_PORT must be an unused TCP port between 1024 and 65535.");
  process.exit(64);
}

if (!["127.0.0.1", "0.0.0.0"].includes(host)) {
  console.error("WATERPUMP_HOST must be 127.0.0.1 or 0.0.0.0.");
  process.exit(64);
}

if (!existsSync("dist/server/wrangler.json")) {
  console.error("Build output is missing. Run pnpm build before starting the service.");
  process.exit(66);
}

const child = spawn(
  process.execPath,
  [
    "--import",
    "./scripts/sites-env.mjs",
    "./node_modules/wrangler/bin/wrangler.js",
    "dev",
    "--config",
    "dist/server/wrangler.json",
    "--local",
    "--ip",
    host,
    "--port",
    String(port),
    "--inspector-port",
    "0",
    "--persist-to",
    ".wrangler/state",
  ],
  { stdio: "inherit", env: process.env },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});

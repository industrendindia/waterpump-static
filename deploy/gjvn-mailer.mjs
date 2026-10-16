import http from "node:http";
import tls from "node:tls";

const host = process.env.MAILER_HOST || "127.0.0.1";
const port = Number(process.env.MAILER_PORT || 8792);
const smtpHost = process.env.SMTP_HOST || "mail.gjvn.co.in";
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpUser = process.env.SMTP_USER || "mail@gjvn.co.in";
const smtpPassword = process.env.SMTP_PASSWORD;
const recipient = process.env.MAIL_TO || "mail@gjvn.co.in";
const allowedOrigin = process.env.ALLOWED_ORIGIN || "https://gjvn.co.in";

if (!smtpPassword) throw new Error("SMTP_PASSWORD is required");

const clean = (value, limit) => String(value || "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, limit);
const header = (value, limit) => clean(value, limit).replace(/[\r\n]/g, " ");
const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const sendJson = (response, status, body) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
};

function smtpSend({ name, company, email, phone, requirement }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: smtpHost, port: smtpPort, servername: smtpHost, rejectUnauthorized: true });
    let buffer = "";
    let waiting;
    const timeout = setTimeout(() => socket.destroy(new Error("SMTP timeout")), 20000);

    const nextResponse = () => new Promise((res, rej) => { waiting = { res, rej }; });
    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split("\r\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (/^\d{3} /.test(line) && waiting) {
          const pending = waiting;
          waiting = undefined;
          const code = Number(line.slice(0, 3));
          code >= 400 ? pending.rej(new Error(`SMTP rejected request (${code})`)) : pending.res(code);
        }
      }
    });
    socket.on("error", reject);
    socket.on("close", () => clearTimeout(timeout));

    const command = async (value, expected) => {
      const response = nextResponse();
      socket.write(`${value}\r\n`);
      const code = await response;
      if (!expected.includes(code)) throw new Error(`Unexpected SMTP response (${code})`);
    };

    socket.once("secureConnect", async () => {
      try {
        const greeting = await nextResponse();
        if (greeting !== 220) throw new Error("SMTP greeting failed");
        await command(`EHLO gjvn.co.in`, [250]);
        await command("AUTH LOGIN", [334]);
        await command(Buffer.from(smtpUser).toString("base64"), [334]);
        await command(Buffer.from(smtpPassword).toString("base64"), [235]);
        await command(`MAIL FROM:<${smtpUser}>`, [250]);
        await command(`RCPT TO:<${recipient}>`, [250, 251]);
        await command("DATA", [354]);

        const subject = header(`Website enquiry — ${company || name}`, 180);
        const plain = `New website enquiry\n\nName: ${name}\nCompany: ${company || "—"}\nEmail: ${email}\nPhone: ${phone || "—"}\n\nRequirement:\n${requirement}`;
        const html = `<h2>New website enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Company:</strong> ${escapeHtml(company || "—")}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p><h3>Requirement</h3><p>${escapeHtml(requirement).replace(/\n/g, "<br>")}</p>`;
        const boundary = `gjvn-${Date.now()}`;
        const message = [
          `From: GJVN Website <${smtpUser}>`,
          `To: ${recipient}`,
          `Reply-To: ${header(email, 160)}`,
          `Subject: ${subject}`,
          "MIME-Version: 1.0",
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          "",
          `--${boundary}`,
          "Content-Type: text/plain; charset=utf-8",
          "Content-Transfer-Encoding: 8bit",
          "",
          plain,
          `--${boundary}`,
          "Content-Type: text/html; charset=utf-8",
          "Content-Transfer-Encoding: 8bit",
          "",
          html,
          `--${boundary}--`,
          ".",
        ].join("\r\n").replace(/\r\n\.\r\n/g, "\r\n..\r\n");
        await command(message, [250]);
        await command("QUIT", [221]);
        clearTimeout(timeout);
        socket.end();
        resolve();
      } catch (error) {
        clearTimeout(timeout);
        socket.destroy();
        reject(error);
      }
    });
  });
}

const attempts = new Map();
const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/health") return sendJson(response, 200, { ok: true });
  if (request.method !== "POST" || request.url !== "/api/enquiry") return sendJson(response, 404, { ok: false });
  if (request.headers.origin && ![allowedOrigin, "https://www.gjvn.co.in"].includes(request.headers.origin)) return sendJson(response, 403, { ok: false });

  const client = String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown").split(",")[0].trim();
  const recent = (attempts.get(client) || []).filter((time) => Date.now() - time < 600000);
  if (recent.length >= 5) return sendJson(response, 429, { ok: false, error: "Please try again later." });
  attempts.set(client, [...recent, Date.now()]);

  let raw = "";
  request.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 12000) request.destroy();
  });
  request.on("end", async () => {
    try {
      const data = JSON.parse(raw);
      const enquiry = {
        name: clean(data.name, 100),
        company: clean(data.company, 120),
        email: header(data.email, 160),
        phone: header(data.phone, 40),
        requirement: clean(data.requirement, 3000),
      };
      if (!enquiry.name || !enquiry.requirement || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return sendJson(response, 400, { ok: false, error: "Invalid enquiry." });
      await smtpSend(enquiry);
      sendJson(response, 200, { ok: true });
    } catch (error) {
      console.error(new Date().toISOString(), error instanceof Error ? error.message : "Mail error");
      sendJson(response, 500, { ok: false, error: "Unable to send enquiry." });
    }
  });
});

server.listen(port, host, () => console.log(`GJVN mailer listening on http://${host}:${port}`));

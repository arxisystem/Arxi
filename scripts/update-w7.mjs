import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const envText = await fs.readFile(path.resolve(".env.local"), "utf-8");
const env = {};
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const GHOST_URL = env.GHOST_URL;
const ADMIN_KEY = env.GHOST_ADMIN_API_KEY;
const [keyId, keySecret] = ADMIN_KEY.split(":");

function signJwt() {
  const header = { alg: "HS256", typ: "JWT", kid: keyId };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iat: now, exp: now + 5 * 60, aud: "/admin/" };
  const b64url = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const data = `${b64url(header)}.${b64url(payload)}`;
  const sig = crypto
    .createHmac("sha256", Buffer.from(keySecret, "hex"))
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return { fm, body: m[2] };
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMd(s) {
  s = escapeHtml(s);
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return s;
}

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  let html = "";
  let buf = [];
  const flush = () => {
    if (buf.length) {
      html += `<p>${inlineMd(buf.join(" "))}</p>\n`;
      buf = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line === "---") {
      flush();
      html += "<hr>\n";
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      flush();
      const level = h[1].length;
      html += `<h${level}>${inlineMd(h[2])}</h${level}>\n`;
      continue;
    }
    buf.push(line);
  }
  flush();
  return html.trim();
}

const POST_ID = "69fc4ae3f7c70a0001432b9b";
const FILE =
  "C:/Users/user/Desktop/Google雲端備份/ObsidianCore/20-Projects/Content-Drafts/W7-我陪妳走不替妳走.md";

const text = await fs.readFile(FILE, "utf-8");
const { body } = parseFrontmatter(text);
const bodyNoTitle = body.replace(/^\s*#\s+.+\r?\n+/, "");
const html = mdToHtml(bodyNoTitle);

const getRes = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${POST_ID}/?source=html`, {
  headers: { Authorization: `Ghost ${signJwt()}` },
});
const getData = await getRes.json();
const updated_at = getData.posts[0].updated_at;

const putRes = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${POST_ID}/?source=html`, {
  method: "PUT",
  headers: {
    Authorization: `Ghost ${signJwt()}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    posts: [{ html, updated_at }],
  }),
});

if (!putRes.ok) {
  console.error(`FAIL ${putRes.status}`);
  console.error(await putRes.text());
  process.exit(1);
}
const data = await putRes.json();
console.log(`OK  W7 updated  ->  ${data.posts[0].url}`);

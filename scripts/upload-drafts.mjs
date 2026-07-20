import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const ENV_PATH = path.resolve(".env.local");
const envText = await fs.readFile(ENV_PATH, "utf-8");
const env = {};
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const GHOST_URL = env.GHOST_URL;
const ADMIN_KEY = env.GHOST_ADMIN_API_KEY;

if (!GHOST_URL || !ADMIN_KEY) {
  console.error("Missing GHOST_URL or GHOST_ADMIN_API_KEY in .env.local");
  process.exit(1);
}

const [keyId, keySecret] = ADMIN_KEY.split(":");
if (!keyId || !keySecret) {
  console.error("GHOST_ADMIN_API_KEY must be in id:secret format");
  process.exit(1);
}

function signJwt() {
  const header = { alg: "HS256", typ: "JWT", kid: keyId };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iat: now, exp: now + 5 * 60, aud: "/admin/" };
  const b64url = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
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
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

const BASE_DIR =
  "C:/Users/user/Desktop/Google雲端備份/ObsidianCore/20-Projects/Content-Drafts";

const FILES = [
  "W2-身體只有一個任務.md",
  "W3-她把首飾收進了包包.md",
  "W4.1-同一個追問三個章節.md",
  "W4.2-辛苦了我知道找答案有多辛苦.md",
  "W5.1-冰融化了.md",
  "W5.2-疼痛的部位通常只是受害者.md",
  "W6-呼吸被低估的鑰匙.md",
  "W7-我陪妳走不替妳走.md",
];

let ok = 0;
let fail = 0;

for (const file of FILES) {
  const full = path.join(BASE_DIR, file);
  try {
    const text = await fs.readFile(full, "utf-8");
    const { fm, body } = parseFrontmatter(text);
    const title = fm.title || file.replace(/\.md$/, "");

    const bodyNoTitle = body.replace(/^\s*#\s+.+\r?\n+/, "");
    const html = mdToHtml(bodyNoTitle);

    const url = `${GHOST_URL}/ghost/api/admin/posts/?source=html`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Ghost ${signJwt()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        posts: [
          {
            title,
            html,
            status: "draft",
            tags: [{ name: "writing" }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`FAIL  ${file}: ${res.status} ${res.statusText}`);
      console.error(`      ${errText.slice(0, 400)}`);
      fail++;
      continue;
    }

    const data = await res.json();
    const post = data.posts?.[0];
    console.log(`OK    ${file}  ->  id=${post?.id}  slug=${post?.slug}`);
    ok++;
  } catch (e) {
    console.error(`FAIL  ${file}: ${e.message}`);
    fail++;
  }
}

console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);

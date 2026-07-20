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

// Top-of-list -> bottom-of-list. W2 newest, W7 oldest.
const ORDER = [
  { id: "69fc4adff7c70a0001432b78", label: "W2" },
  { id: "69fc4ae0f7c70a0001432b7d", label: "W3" },
  { id: "69fc4ae1f7c70a0001432b82", label: "W4.1" },
  { id: "69fc4ae1f7c70a0001432b87", label: "W4.2" },
  { id: "69fc4ae2f7c70a0001432b8c", label: "W5.1" },
  { id: "69fc4ae2f7c70a0001432b91", label: "W5.2" },
  { id: "69fc4ae3f7c70a0001432b96", label: "W6" },
  { id: "69fc4ae3f7c70a0001432b9b", label: "W7" },
];

const baseTime = Date.now();
let ok = 0;
let fail = 0;

for (let i = 0; i < ORDER.length; i++) {
  const { id, label } = ORDER[i];
  const newPublishedAt = new Date(baseTime - i * 60 * 1000).toISOString();

  try {
    const getRes = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${id}/`, {
      headers: { Authorization: `Ghost ${signJwt()}` },
    });
    if (!getRes.ok) {
      console.error(`FAIL  ${label}: GET ${getRes.status}`);
      fail++;
      continue;
    }
    const getData = await getRes.json();
    const updated_at = getData.posts[0].updated_at;

    const putRes = await fetch(`${GHOST_URL}/ghost/api/admin/posts/${id}/`, {
      method: "PUT",
      headers: {
        Authorization: `Ghost ${signJwt()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        posts: [
          {
            published_at: newPublishedAt,
            updated_at,
          },
        ],
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error(`FAIL  ${label}: PUT ${putRes.status} ${errText.slice(0, 300)}`);
      fail++;
      continue;
    }

    const data = await putRes.json();
    const p = data.posts[0];
    console.log(`OK    ${label}  ${p.title}  ->  published_at=${p.published_at}`);
    ok++;
  } catch (e) {
    console.error(`FAIL  ${label}: ${e.message}`);
    fail++;
  }
}

console.log(`\nDone. ${ok} reordered, ${fail} failed.`);

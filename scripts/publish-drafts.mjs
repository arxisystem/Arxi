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

const POST_IDS = [
  "69fc4adff7c70a0001432b78", // W2
  "69fc4ae0f7c70a0001432b7d", // W3
  "69fc4ae1f7c70a0001432b82", // W4.1
  "69fc4ae1f7c70a0001432b87", // W4.2
  "69fc4ae2f7c70a0001432b8c", // W5.1
  "69fc4ae2f7c70a0001432b91", // W5.2
  "69fc4ae3f7c70a0001432b96", // W6
  "69fc4ae3f7c70a0001432b9b", // W7
];

let ok = 0;
let fail = 0;

for (const id of POST_IDS) {
  try {
    const getRes = await fetch(
      `${GHOST_URL}/ghost/api/admin/posts/${id}/`,
      { headers: { Authorization: `Ghost ${signJwt()}` } },
    );
    if (!getRes.ok) {
      console.error(`FAIL  ${id}: GET ${getRes.status}`);
      fail++;
      continue;
    }
    const getData = await getRes.json();
    const post = getData.posts?.[0];
    if (!post) {
      console.error(`FAIL  ${id}: not found`);
      fail++;
      continue;
    }

    const putRes = await fetch(
      `${GHOST_URL}/ghost/api/admin/posts/${id}/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Ghost ${signJwt()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          posts: [
            {
              status: "published",
              updated_at: post.updated_at,
            },
          ],
        }),
      },
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.error(`FAIL  ${id}: PUT ${putRes.status} ${errText.slice(0, 300)}`);
      fail++;
      continue;
    }

    const data = await putRes.json();
    const p = data.posts?.[0];
    console.log(`OK    ${p.title}  ->  ${p.url}`);
    ok++;
  } catch (e) {
    console.error(`FAIL  ${id}: ${e.message}`);
    fail++;
  }
}

console.log(`\nDone. ${ok} published, ${fail} failed.`);

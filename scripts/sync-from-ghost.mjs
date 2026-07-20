import fs from "node:fs/promises";
import path from "node:path";

const envText = await fs.readFile(path.resolve(".env.local"), "utf-8");
const env = {};
for (const l of envText.split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const BASE =
  "C:/Users/user/Desktop/Google雲端備份/ObsidianCore/20-Projects/Content-Drafts";

// slug → 本地草稿檔名（建立時固定，不隨標題改）
const MAP = {
  "an-quan-bu-shi-fang-song-shi-li-liang": "W1-安全不是放鬆是力量.md",
  "shen-ti-zhi-you-yi-ge-ren-wu-xiang-ban-fa-huo-xia-qu":
    "W2-身體只有一個任務.md",
  "ta-ba-shou-shi-shou-jin-liao-bao-bao": "W3-她把首飾收進了包包.md",
  "tong-yi-ge-zhui-wen-san-ge-zhang-jie": "W4.1-同一個追問三個章節.md",
  "xin-ku-liao-wo-zhi-dao-zhao-da-an-you-duo-xin-ku":
    "W4.2-辛苦了我知道找答案有多辛苦.md",
  "bing-rong-hua-liao": "W5.1-冰融化了.md",
  "teng-tong-de-bu-wei-tong-chang-zhi-shi-shou-hai-zhe":
    "W5.2-疼痛的部位通常只是受害者.md",
  "hu-xi-bei-di-gu-de-yao-chi": "W6-呼吸被低估的鑰匙.md",
  "wo-pei-nai-zou-bu-ti-nai-zou": "W7-我陪妳走不替妳走.md",
};

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

function htmlToMd(html) {
  let s = html;
  s = s.replace(/<\s*br\s*\/?>/gi, "\n");
  s = s.replace(/<\s*hr\s*\/?>/gi, "\n\n---\n\n");
  s = s.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  s = s.replace(/<\/?p[^>]*>/gi, "");
  s = s.replace(/<\s*strong\s*>(.*?)<\/\s*strong\s*>/gis, "**$1**");
  s = s.replace(/<\s*b\s*>(.*?)<\/\s*b\s*>/gis, "**$1**");
  s = s.replace(/<\s*em\s*>(.*?)<\/\s*em\s*>/gis, "*$1*");
  s = s.replace(/<\s*i\s*>(.*?)<\/\s*i\s*>/gis, "*$1*");
  s = s.replace(/<\/?h[1-6][^>]*>/gi, "\n\n");
  s = s.replace(/<[^>]+>/g, ""); // 其餘標籤剝掉
  s = decodeEntities(s);
  s = s.replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

const today = "2026-05-17";
let ok = 0;

for (const [slug, file] of Object.entries(MAP)) {
  const url =
    `${env.GHOST_URL}/ghost/api/content/posts/slug/${slug}/` +
    `?key=${env.GHOST_CONTENT_API_KEY}&fields=title,html,updated_at`;
  const r = await fetch(url);
  const d = await r.json();
  const post = d.posts?.[0];
  if (!post) {
    console.error(`MISS  ${slug}`);
    continue;
  }

  const fullPath = path.join(BASE, file);
  const original = await fs.readFile(fullPath, "utf-8");
  const fmMatch = original.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  let fm = fmMatch ? fmMatch[1] : "";

  // 更新 title 為 Ghost 現況；補/更新 synced_from_ghost 日期
  if (/^title:.*$/m.test(fm)) {
    fm = fm.replace(/^title:.*$/m, `title: ${post.title}`);
  } else {
    fm += `\ntitle: ${post.title}`;
  }
  if (/^synced_from_ghost:.*$/m.test(fm)) {
    fm = fm.replace(/^synced_from_ghost:.*$/m, `synced_from_ghost: ${today}`);
  } else {
    fm += `\nsynced_from_ghost: ${today}`;
  }

  const body = htmlToMd(post.html);
  const out = `---\n${fm}\n---\n\n# ${post.title}\n\n${body}\n`;
  await fs.writeFile(fullPath, out, "utf-8");
  console.log(`OK    ${file}  ←  「${post.title}」`);
  ok++;
}

console.log(`\nDone. ${ok}/${Object.keys(MAP).length} synced from Ghost.`);
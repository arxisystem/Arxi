/**
 * 給 next/og ImageResponse 用的字型載入器。
 *
 * 從 Google Fonts API 抓 Noto Serif TC 的「subset」——只包含這張圖會用到的字，
 * 而不是整個 7000+ 漢字的 ttf。
 *
 * 用法：
 *   const fontData = await loadNotoSerifTC("太曦 安全不是放鬆")
 *   return new ImageResponse(jsx, {
 *     fonts: fontData ? [{ name: "Noto Serif TC", data: fontData, ... }] : undefined,
 *   })
 *
 * 失敗時回 null，呼叫端應回退到系統字型（不要讓 OG 整個爆掉）。
 */

// Satori 支援 ttf / otf / woff，但**不**支援 woff2。
// Google Fonts 會根據 UA 決定回什麼格式：
//   - 現代瀏覽器 UA → woff2（Satori 不吃）
//   - Safari 10 / Edge 14 之前的 UA → woff（Satori 吃）
//   - 沒 UA → 可能 ttf
// 用 Safari 9（2015）UA 來確保拿到 woff 格式。
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7";

// 接受的格式（依 Satori 支援度由佳到次）
const ACCEPTED_FORMATS = ["truetype", "opentype", "woff"] as const;

export async function loadNotoSerifTC(
  text: string,
  weight: 400 | 500 | 600 = 500,
): Promise<ArrayBuffer | null> {
  // 去重，減少 URL 長度
  const uniqueText = Array.from(new Set(text.split(""))).join("");

  const cssUrl = new URL("https://fonts.googleapis.com/css2");
  cssUrl.searchParams.set("family", `Noto Serif TC:wght@${weight}`);
  cssUrl.searchParams.set("text", uniqueText);

  try {
    const cssRes = await fetch(cssUrl.toString(), {
      headers: { "User-Agent": UA },
    });
    if (!cssRes.ok) return null;

    const css = await cssRes.text();

    // 抽出所有 src: url(...) format(...) 配對
    const matches = Array.from(
      css.matchAll(
        /src:\s*url\((https:\/\/[^)]+)\)\s*format\(['"]?([^'")]+)['"]?\)/g,
      ),
    );

    // 依 ACCEPTED_FORMATS 順序找第一個能用的
    let fontUrl: string | null = null;
    for (const fmt of ACCEPTED_FORMATS) {
      const m = matches.find((m) => m[2] === fmt);
      if (m) {
        fontUrl = m[1];
        break;
      }
    }

    if (!fontUrl) return null;

    const fontRes = await fetch(fontUrl);
    if (!fontRes.ok) return null;

    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

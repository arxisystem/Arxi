import { ImageResponse } from "next/og";
import { loadNotoSerifTC } from "@/lib/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "太曦 Arxi｜身心調息";

const TOP = "太曦 ARXI";
const TITLE_LINE_1 = "安全不是放鬆，";
const TITLE_LINE_2 = "是力量。";
const BOTTOM = "身心調息";

export default async function Image() {
  const allText = TOP + TITLE_LINE_1 + TITLE_LINE_2 + BOTTOM;
  const fontData = await loadNotoSerifTC(allText, 500);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f5efe2",
          color: "#1f1810",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 100px",
          fontFamily: "Noto Serif TC, serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.4em",
            color: "#7a6e5e",
          }}
        >
          {TOP}
        </div>

        <div
          style={{
            fontSize: 96,
            letterSpacing: "0.06em",
            lineHeight: 1.45,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>{TITLE_LINE_1}</span>
          <span>{TITLE_LINE_2}</span>
        </div>

        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.35em",
            color: "#7a6e5e",
          }}
        >
          {BOTTOM}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Noto Serif TC",
              data: fontData,
              style: "normal",
              weight: 500,
            },
          ]
        : undefined,
    },
  );
}

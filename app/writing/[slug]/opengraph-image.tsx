import { ImageResponse } from "next/og";
import { getPost } from "@/lib/ghost";
import { loadNotoSerifTC } from "@/lib/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "太曦 Arxi 文章";

type Props = {
  params: Promise<{ slug: string }>;
};

const TOP = "太曦 ARXI · 文章";
const BOTTOM = "身心調息";

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  const title = post?.title ?? "太曦 Arxi";

  const fontData = await loadNotoSerifTC(TOP + title + BOTTOM, 500);

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
            fontSize: 24,
            letterSpacing: "0.4em",
            color: "#7a6e5e",
          }}
        >
          {TOP}
        </div>

        <div
          style={{
            fontSize: 72,
            letterSpacing: "0.05em",
            lineHeight: 1.45,
            display: "flex",
            maxWidth: "100%",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.3em",
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

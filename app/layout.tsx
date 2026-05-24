import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Analytics } from "./components/Analytics";

/**
 * Body Mirror（/login /practice /admin）是獨立 app，不該顯示 arxi.tw 主站的 Nav/Footer。
 * middleware.ts 把當前 pathname 寫進 `x-pathname` header；這裡讀來判斷渲染哪種 layout。
 */
const BODY_MIRROR_PREFIXES = ["/login", "/practice", "/admin"];

function isBodyMirrorRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return BODY_MIRROR_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-tc",
});

const notoSansTC = Noto_Sans_TC({
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
  variable: "--font-noto-sans-tc",
});

const SITE_NAME = "太曦 Arxi";
const SITE_DESCRIPTION =
  "身體與感受，從來不是分開的。失衡，往往源自一個被忽略的關鍵——呼吸。給找尋答案已久的你，一個重新找回安全與力量的入口。";

export const metadata: Metadata = {
  metadataBase: new URL("https://arxi.tw"),
  title: {
    default: `${SITE_NAME}｜身心調息`,
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: {
      default: `${SITE_NAME}｜身心調息`,
      template: `%s｜${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "zh_TW",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: `${SITE_NAME}｜身心調息`,
      template: `%s｜${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname");
  const bodyMirror = isBodyMirrorRoute(pathname);

  return (
    <html
      lang="zh-Hant"
      className={`${notoSerifTC.variable} ${notoSansTC.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        {bodyMirror ? (
          // Body Mirror：裸 body、不渲染主站 Nav/Footer。Analytics 仍保留（追蹤所有頁）。
          <>
            {children}
            <Analytics />
          </>
        ) : (
          <>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}

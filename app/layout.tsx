import type { Metadata } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Analytics } from "./components/Analytics";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSerifTC.variable} ${notoSansTC.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

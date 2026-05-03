import type { MetadataRoute } from "next";

const BASE_URL = "https://arxi.tw";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /book 是 LINE 跳轉頁，沒必要被搜尋引擎索引
        disallow: ["/book"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

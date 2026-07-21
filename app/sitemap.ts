import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/ghost";

const BASE_URL = "https://arxi.tw";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/method`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/teaching`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/voices`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/subscribe`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // /book 是 LINE 跳轉頁，不放進 sitemap
  ];

  // 抓所有 writing + teaching post（有失敗就回空陣列，不要讓 sitemap 整個爆掉）
  const [writing, teaching] = await Promise.all([
    getPosts({ tag: "writing" }).catch(() => []),
    getPosts({ tag: "teaching" }).catch(() => []),
  ]);

  const writingPages: MetadataRoute.Sitemap = writing.map((p) => ({
    url: `${BASE_URL}/writing/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const teachingPages: MetadataRoute.Sitemap = teaching.map((p) => ({
    url: `${BASE_URL}/teaching/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...writingPages, ...teachingPages];
}

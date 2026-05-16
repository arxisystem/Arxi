const GHOST_URL = process.env.GHOST_URL;
const GHOST_KEY = process.env.GHOST_CONTENT_API_KEY;

if (!GHOST_URL || !GHOST_KEY) {
  throw new Error("Missing GHOST_URL or GHOST_CONTENT_API_KEY in .env.local");
}

export type GhostTag = {
  id: string;
  name: string;
  slug: string;
};

export type GhostPost = {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  feature_image: string | null;
  feature_image_alt: string | null;
  feature_image_caption: string | null;
  excerpt: string;
  custom_excerpt: string | null;
  reading_time: number;
  published_at: string;
  updated_at: string;
  tags?: GhostTag[];
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  og_title: string | null;
  og_description: string | null;
  twitter_image: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
};

export type GhostPage = GhostPost;

const REVALIDATE_SECONDS = 60 * 60;
const IS_DEV = process.env.NODE_ENV === "development";

async function ghostFetch<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${GHOST_URL}/ghost/api/content${path}`);
  url.searchParams.set("key", GHOST_KEY!);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  // Dev：不快取，方便邊改 Ghost 邊看結果
  // Prod：快取 1 小時（ISR）
  const res = await fetch(
    url.toString(),
    IS_DEV
      ? { cache: "no-store" }
      : { next: { revalidate: REVALIDATE_SECONDS } },
  );

  if (!res.ok) {
    throw new Error(`Ghost API ${res.status} ${res.statusText} at ${path}`);
  }

  return res.json() as Promise<T>;
}

type PostListOptions = {
  tag?: string;
  limit?: number;
};

// 文章排序：在 Ghost 後台給文章掛一般標籤 order-1 / order-2 / …
// 數字小的排前面；沒掛的排在所有 order 文章之後，照 Ghost 預設（發布日期，新→舊）。
const ORDER_TAG_RE = /^order-(\d+)$/;

function orderRank(post: GhostPost): number {
  for (const tag of post.tags ?? []) {
    const m = ORDER_TAG_RE.exec(tag.slug) || ORDER_TAG_RE.exec(tag.name);
    if (m) return Number(m[1]);
  }
  return Number.POSITIVE_INFINITY;
}

export async function getPosts(
  opts: PostListOptions = {},
): Promise<GhostPost[]> {
  const params: Record<string, string> = {
    include: "tags",
    // 先抓全部，排序後再 slice——不能在 API 端 limit，
    // 否則 Ghost 會先用發布日期挑前 N 筆，order 標籤就失效了。
    limit: "all",
  };
  if (opts.tag) params.filter = `tag:${opts.tag}`;

  const data = await ghostFetch<{ posts: GhostPost[] }>("/posts/", params);

  // 穩定排序：order-N 由小到大排最前；其餘維持 Ghost 原本的日期順序。
  const sorted = data.posts
    .map((post, i) => ({ post, i, rank: orderRank(post) }))
    .sort((a, b) => a.rank - b.rank || a.i - b.i)
    .map((x) => x.post);

  return opts.limit ? sorted.slice(0, opts.limit) : sorted;
}

export async function getPost(slug: string): Promise<GhostPost | null> {
  try {
    const data = await ghostFetch<{ posts: GhostPost[] }>(
      `/posts/slug/${slug}/`,
      { include: "tags" },
    );
    return data.posts[0] ?? null;
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

export async function getPage(slug: string): Promise<GhostPage | null> {
  try {
    const data = await ghostFetch<{ pages: GhostPage[] }>(
      `/pages/slug/${slug}/`,
    );
    return data.pages[0] ?? null;
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

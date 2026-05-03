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

export async function getPosts(
  opts: PostListOptions = {},
): Promise<GhostPost[]> {
  const params: Record<string, string> = {
    include: "tags",
  };
  if (opts.tag) params.filter = `tag:${opts.tag}`;
  if (opts.limit) params.limit = String(opts.limit);

  const data = await ghostFetch<{ posts: GhostPost[] }>("/posts/", params);
  return data.posts;
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

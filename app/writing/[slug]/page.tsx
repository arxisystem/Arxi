import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/ghost";
import { PostFooter } from "../../components/PostFooter";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 建置時把所有 writing 文章預先靜態生成。
// 這樣每次 Ghost webhook 觸發 Vercel 重建，內頁就會跟列表頁一起重新抓取最新內容。
// 新文章在下次重建前仍可即時 server-render（dynamicParams 預設為 true）。
export async function generateStaticParams() {
  const posts = await getPosts({ tag: "writing" });
  return posts.map((post) => ({ slug: post.slug }));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "找不到文章" };

  const title = post.meta_title || post.title;
  const description =
    post.meta_description || post.custom_excerpt || post.excerpt || undefined;
  const url = `/writing/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at,
    },
    twitter: { title, description },
  };
}

export default async function WritingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:py-20 md:py-24">
      <Link
        href="/writing"
        className="font-sans text-xs tracking-[0.3em] text-ink-muted hover:text-ink uppercase transition-colors"
      >
        ← 全部文章
      </Link>

      <header className="mt-12 mb-16">
        <div className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">
          <time dateTime={post.published_at}>
            {formatDate(post.published_at)}
          </time>
          {post.reading_time > 0 && (
            <span className="ml-3">{post.reading_time} 分鐘閱讀</span>
          )}
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl tracking-[0.05em] leading-snug">
          {post.title}
        </h1>
      </header>

      {post.feature_image && (
        // Ghost 的 feature image。直接用 <img>——避開 next/image 的 loader 配置複雜度。
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.feature_image}
          alt={post.feature_image_alt ?? post.title}
          className="w-full h-auto mb-16"
        />
      )}

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      <PostFooter section="writing" />
    </article>
  );
}

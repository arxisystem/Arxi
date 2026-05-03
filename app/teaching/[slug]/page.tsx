import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/ghost";
import { PostFooter } from "../../components/PostFooter";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
  if (!post) return { title: "找不到教學文" };
  return {
    title: post.meta_title || post.title,
    description:
      post.meta_description || post.custom_excerpt || post.excerpt || undefined,
  };
}

export default async function TeachingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <Link
        href="/teaching"
        className="font-sans text-xs tracking-[0.3em] text-ink-muted hover:text-ink uppercase transition-colors"
      >
        ← 全部教學
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

      <PostFooter section="teaching" />
    </article>
  );
}

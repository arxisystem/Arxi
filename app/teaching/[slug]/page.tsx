import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/ghost";
import { PostFooter } from "../../components/PostFooter";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// 建置時把所有 teaching 文章預先靜態生成（理由同 writing/[slug]）。
export async function generateStaticParams() {
  const posts = await getPosts({ tag: "teaching" });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "找不到教學文" };

  const title = post.meta_title || post.title;
  const description =
    post.meta_description || post.custom_excerpt || post.excerpt || undefined;
  const url = `/teaching/${post.slug}`;

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

export default async function TeachingPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:py-20 md:py-24">
      <Link
        href="/teaching"
        className="font-sans text-xs tracking-[0.3em] text-ink-muted hover:text-ink uppercase transition-colors"
      >
        ← 全部教學
      </Link>

      <header className="mt-12 mb-16">
        <div className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">
          {post.reading_time > 0 && (
            <span>{post.reading_time} 分鐘閱讀</span>
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

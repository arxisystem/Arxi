import Link from "next/link";
import type { GhostPost } from "@/lib/ghost";

type PostCardProps = {
  post: GhostPost;
  /** Which top-level section this card lives in. Affects the `/writing/...` vs `/teaching/...` href. */
  section: "writing" | "teaching";
};

function formatDate(iso: string): string {
  // 2026-04-21T... → 2026.04.21
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export function PostCard({ post, section }: PostCardProps) {
  const href = `/${section}/${post.slug}`;
  const excerpt = post.custom_excerpt || post.excerpt;

  return (
    <article className="border-b border-rule py-10 first:pt-0">
      <Link href={href} className="group block">
        <div className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          {post.reading_time > 0 && (
            <span className="ml-3">{post.reading_time} 分鐘閱讀</span>
          )}
        </div>
        <h3 className="mt-3 text-2xl tracking-[0.05em] leading-snug group-hover:text-ink-muted transition-colors">
          {post.title}
        </h3>
        {excerpt && (
          <p className="mt-3 text-ink-muted leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}

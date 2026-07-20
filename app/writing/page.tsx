import type { Metadata } from "next";
import { getPosts } from "@/lib/ghost";
import { PostCard } from "../components/PostCard";

export const metadata: Metadata = {
  title: "文章",
  description: "關於身體、呼吸，以及那些值得重新看一遍的事。",
  alternates: { canonical: "/writing" },
  openGraph: {
    title: "文章",
    description: "關於身體、呼吸，以及那些值得重新看一遍的事。",
    url: "/writing",
  },
};

export default async function WritingPage() {
  const posts = await getPosts({ tag: "writing" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 md:py-32">
      <header className="mb-20">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          文章
        </p>
        <h1 className="mt-6 text-3xl sm:text-4xl tracking-[0.05em] leading-snug">
          關於身體、呼吸，以及那些值得重新看一遍的事。
        </h1>
      </header>

      {posts.length === 0 ? (
        <p className="font-sans text-sm tracking-[0.2em] text-ink-soft">
          尚無文章。
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} section="writing" />
          ))}
        </div>
      )}
    </div>
  );
}

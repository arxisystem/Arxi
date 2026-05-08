import type { Metadata } from "next";
import { getPosts } from "@/lib/ghost";
import { PostCard } from "../components/PostCard";

export const metadata: Metadata = {
  title: "教學",
  description: "網球肘、經絡、急性腎炎——一篇一個身體主題。",
  alternates: { canonical: "/teaching" },
  openGraph: {
    title: "教學",
    description: "網球肘、經絡、急性腎炎——一篇一個身體主題。",
    url: "/teaching",
  },
};

export default async function TeachingPage() {
  const posts = await getPosts({ tag: "teaching" });

  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <header className="mb-20">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          教學
        </p>
        <h1 className="mt-6 text-3xl sm:text-4xl tracking-[0.05em] leading-snug">
          網球肘、經絡、急性腎炎——一篇一個身體主題。
        </h1>
      </header>

      {posts.length === 0 ? (
        <p className="font-sans text-sm tracking-[0.2em] text-ink-soft">
          尚無教學文。
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} section="teaching" />
          ))}
        </div>
      )}
    </div>
  );
}

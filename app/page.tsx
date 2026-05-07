import Link from "next/link";
import { getPosts } from "@/lib/ghost";
import { PostCard } from "./components/PostCard";
import { TrackedLink } from "./components/TrackedLink";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export default async function Home() {
  // 首頁「最新文章」區——抓 writing tag 的最新 3 篇。
  // W1 還沒上 tag 時這個 list 會是空的，UI 會自動隱藏該段。
  const latestPosts = await getPosts({ tag: "writing", limit: 3 });

  return (
    <>
      {/* ── Hero ── 照片在上、文字緊貼底部，徹底避開臉 */}
      <section
        className="relative min-h-screen flex items-end overflow-hidden bg-ink"
        style={{
          backgroundImage: "url('/images/founder-hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 15%",
        }}
      >
        {/* 漸層 overlay：頂部極輕、底部加深至 80%——頭部清楚、文字背景強對比 */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/5" />

        <div className="relative w-full px-6 pb-10 sm:pb-14">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[0.05em] leading-[1.35] text-paper whitespace-nowrap">
              安全不是放鬆，是力量。
            </h1>
            <div className="mt-10 sm:mt-12">
              <TrackedLink
                href={LINE_BOOK_URL}
                event="book_click_hero"
                className="font-sans text-sm tracking-[0.3em] uppercase text-paper hover:opacity-70 transition-opacity border-b border-paper/50 pb-1"
              >
                預約初次諮詢 →
              </TrackedLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── 太曦是什麼 ── */}
      <section className="px-6 py-32 border-t border-rule">
        <div className="mx-auto max-w-2xl">
          <p className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-10">
            太曦是什麼
          </p>
          <p className="text-lg leading-loose">
            太曦是一個以呼吸為核心的身心整合品牌。
          </p>
          <div className="mt-6 text-lg leading-loose text-ink-muted space-y-2">
            <p>我相信，真正帶來安全感的不是放鬆，而是尚未喚醒的原始力量。</p>
            <p>透過徒手調整呼吸，喚醒身體本有的機能，心靈隨之轉化。</p>
            <p>——這裡，是你重新認識自己的起點。</p>
          </div>
        </div>
      </section>

      {/* ── 關於我 ── */}
      <section className="px-6 py-32 border-t border-rule">
        <div className="mx-auto max-w-2xl">
          <p className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-10">
            關於我
          </p>
          <div className="text-lg leading-loose space-y-2">
            <p>台大數學、巴黎音樂院、後中醫學系</p>
            <p>去過各式各樣的領域，我追問的始終是同一件事。</p>
            <p>在這過程中，我轉而向內——發現身體與情緒底下，藏著一直在找的答案。</p>
          </div>
          <p className="mt-6 text-lg leading-loose text-ink-muted">
            投入身心整合工作五年，太曦，是我走過那條路之後，邀請你一同啟程的起點。
          </p>
          <Link
            href="/about"
            className="inline-block mt-10 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors border-b border-rule pb-1"
          >
            完整故事
          </Link>
        </div>
      </section>

      {/* ── 最新文章 ── */}
      {latestPosts.length > 0 && (
        <section className="px-6 py-32 border-t border-rule">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-baseline justify-between mb-12">
              <p className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase">
                最新文章
              </p>
              <Link
                href="/writing"
                className="font-sans text-xs tracking-[0.25em] text-ink-muted hover:text-ink transition-colors"
              >
                全部 →
              </Link>
            </div>
            <div>
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} section="writing" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 預約入口 ── */}
      <section className="px-6 py-32 border-t border-rule">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-10">
            如果你準備好了...
          </p>
          <p className="text-lg leading-loose mb-12">
            這是一對一的過程
            <br /><br />
            有對話，有覺察，有探索。
            <br /><br />
            可能會有不適，可能會有挑戰。
            <br /><br />
            但那往往是身體開始說話的時候——你聽到了嗎？
          </p>
          <TrackedLink
            href={LINE_BOOK_URL}
            event="book_click_hero"
            className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper px-10 py-4 hover:opacity-85 transition-opacity"
          >
            預約初次諮詢
          </TrackedLink>

        </div>
      </section>
    </>
  );
}

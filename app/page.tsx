import Link from "next/link";
import { getPosts } from "@/lib/ghost";
import { voices } from "@/lib/voices";
import { PostCard } from "./components/PostCard";
import { TrackedLink } from "./components/TrackedLink";
import { VoicesCarousel } from "./components/VoicesCarousel";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export default async function Home() {
  // 首頁「最新文章」區——抓 writing tag 的最新 3 篇。
  // W1 還沒上 tag 時這個 list 會是空的，UI 會自動隱藏該段。
  const latestPosts = await getPosts({ tag: "writing", limit: 3 });
  const featuredVoices = voices.filter((v) => v.featured);

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
            <p className="mt-5 sm:mt-7 mx-auto max-w-md sm:max-w-xl font-serif font-light text-sm sm:text-base md:text-lg tracking-[0.1em] leading-loose text-paper/80">
              一對一的身心工作　·　透過徒手與呼吸，喚醒身體本有的力量。
            </p>
            <div className="mt-10 sm:mt-12">
              <TrackedLink
                href={LINE_BOOK_URL}
                event="book_click_hero"
                className="font-sans text-sm tracking-[0.3em] uppercase text-paper hover:opacity-70 transition-opacity border-b border-paper/50 pb-1"
              >
                預約初次體驗 →
              </TrackedLink>
            </div>
            <p className="mt-6 sm:mt-8 font-sans text-[10px] sm:text-xs tracking-[0.32em] uppercase text-paper/55">
              台中北屯　·　一對一　·　2 小時
            </p>
          </div>
        </div>
      </section>

      {/* ── 回響 ── */}
      {featuredVoices.length > 0 && (
        <section className="py-32 border-t border-rule">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="font-serif text-3xl tracking-[0.15em] text-ink">
              回響
            </h2>
            <div className="mt-6 mb-12 w-40 h-px bg-gradient-to-r from-ink-soft to-transparent" aria-hidden />
          </div>

          <VoicesCarousel voices={featuredVoices} />

          <div className="mx-auto max-w-5xl px-6 mt-16 text-right">
            <Link
              href="/voices"
              className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors border-b border-rule pb-1"
            >
              更多回響 →
            </Link>
          </div>
        </section>
      )}

      {/* ── 太曦是什麼 ── */}
      <section className="px-6 py-32 border-t border-rule">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl tracking-[0.15em] text-ink">
            太曦是什麼
          </h2>
          <div className="mt-6 mb-8 w-40 h-px bg-gradient-to-r from-ink-soft to-transparent" aria-hidden />
          <p className="text-lg leading-loose">
            太曦是一個以呼吸為核心的身心整合品牌。
          </p>
          <div className="mt-6 text-lg leading-loose space-y-2">
            <p>我相信，真正帶來安全感的不是放鬆，而是尚未喚醒的原始力量。</p>
            <p>透過徒手調整呼吸，喚醒身體本有的機能，心靈隨之轉化。</p>
            <p>——這裡，是你重新認識自己的起點。</p>
          </div>
        </div>
      </section>

      {/* ── 太曦適合誰 ── */}
      <section className="px-6 py-32 border-t border-rule">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl tracking-[0.15em] text-ink">
            太曦適合誰
          </h2>
          <div className="mt-6 mb-12 w-40 h-px bg-gradient-to-r from-ink-soft to-transparent" aria-hidden />

          <ol className="space-y-12">
            <li className="grid grid-cols-[2em_1fr] gap-4 sm:gap-6 items-baseline">
              <span className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">I</span>
              <div>
                <h3 className="font-serif text-xl tracking-[0.1em] text-ink mb-3">
                  身體反覆不舒服
                </h3>
                <p className="text-lg leading-loose text-ink">
                  身體某處反覆痠痛、緊繃，或說不上來的長期不對——想從別的角度好好認識自己的身體。
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[2em_1fr] gap-4 sm:gap-6 items-baseline">
              <span className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">II</span>
              <div>
                <h3 className="font-serif text-xl tracking-[0.1em] text-ink mb-3">
                  系統性的失調
                </h3>
                <p className="text-lg leading-loose text-ink">
                  長期睡不好、自律神經失調、消化不順、婦科問題反覆——想從整體看身體，不只處理單一症狀。
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[2em_1fr] gap-4 sm:gap-6 items-baseline">
              <span className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">III</span>
              <div>
                <h3 className="font-serif text-xl tracking-[0.1em] text-ink mb-3">
                  心裡的重量
                </h3>
                <p className="text-lg leading-loose text-ink">
                  創傷、麻木、沒有動力、精疲力盡——想找到面對風暴的方式，重新長回有力量的自己。
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[2em_1fr] gap-4 sm:gap-6 items-baseline">
              <span className="font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">IV</span>
              <div>
                <h3 className="font-serif text-xl tracking-[0.1em] text-ink mb-3">
                  為自己而來
                </h3>
                <p className="text-lg leading-loose text-ink">
                  想聽懂身體的語言，或正在探索身心的奧秘、追問生命的真理——想找一個能一起走一段的方式。
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* ── 關於我 ── */}
      <section className="px-6 py-32 border-t border-rule">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl tracking-[0.15em] text-ink">
            關於我
          </h2>
          <div className="mt-6 mb-8 w-40 h-px bg-gradient-to-r from-ink-soft to-transparent" aria-hidden />
          <div className="text-lg leading-loose space-y-2">
            <p>台大數學、巴黎音樂院、後中醫學系</p>
            <p>去過各式各樣的領域，我追問的始終是同一件事。</p>
            <p>在這過程中，我轉而向內——發現身體與情緒底下，藏著一直在找的答案。</p>
          </div>
          <p className="mt-6 text-lg leading-loose">
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
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-serif text-3xl tracking-[0.15em] text-ink">
                最新文章
              </h2>
              <Link
                href="/writing"
                className="font-sans text-xs tracking-[0.25em] text-ink-muted hover:text-ink transition-colors"
              >
                全部 →
              </Link>
            </div>
            <div className="mb-12 w-40 h-px bg-gradient-to-r from-ink-soft to-transparent" aria-hidden />
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
          <h2 className="font-serif text-3xl tracking-[0.15em] text-ink">
            如果你準備好了⋯
          </h2>
          <div className="mx-auto mt-6 mb-10 w-48 h-px bg-gradient-to-r from-transparent via-ink-soft to-transparent" aria-hidden />
          <p className="text-lg leading-loose mb-12">
            這是一對一的過程
            <br /><br />
            有對話，有覺察，有探索。
            <br /><br />
            可能會有不適，可能會有挑戰。
            <br /><br />
            但那往往是身體開始說話的時候——你聽到了嗎？
            <br /><br />
            我們會一起看見全新的世界。
          </p>
          <TrackedLink
            href={LINE_BOOK_URL}
            event="book_click_hero"
            className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper px-10 py-4 hover:opacity-85 transition-opacity"
          >
            預約初次體驗
          </TrackedLink>

        </div>
      </section>
    </>
  );
}

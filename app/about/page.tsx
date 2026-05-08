import Link from "next/link";
import type { Metadata } from "next";
import { TrackedLink } from "../components/TrackedLink";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export const metadata: Metadata = {
  title: "關於",
  description:
    "從數學到音樂，再到身體——張曦昀的轉折，與太曦的核心哲學。",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "關於",
    description:
      "從數學到音樂，再到身體——張曦昀的轉折，與太曦的核心哲學。",
    url: "/about",
  },
};

const sections = [
  {
    label: "追問",
    body: "世界有兩面\n——外在環境發生的一切，以及內在心理所感受的風景。\n數學與音樂，就恰好象徵著我對這兩面的追尋。\n\n數學精美和諧的結構，回應了我對世界運行機制的好奇。\n音樂深刻動人的共鳴，承接了我表達內心情感的渴望。\n\n但我追問的始終是同一件事：世界的真理，以及我與它的關係。",
  },
  {
    label: "發現",
    body: "當身體的力量被喚醒，心靈也會隨之升起。\n當心靈受到衝擊，身體也會一同坍塌。\n\n人們以為是「個性」或「命運」導致的遭遇，背後都有更深的模式。\n人們以為是「習慣」或「不幸」造成的病痛，其中也有隱藏的機轉。\n\n身體的感覺、情緒的走向、行為的重複\n——它們不是隨機的，那是身體說話的方式。\n\n頓悟到這件事的那一刻，我感覺到氣息開始流動了。\n\n身體與心靈，從來不是分開的。\n往內看見自己的同時，也就看見了世界。\n於是我毅然決然踏進醫學的領域。",
  },
  {
    label: "入口",
    body: "呼吸，是轉化這一切的入口。\n藉由徒手的調整，讓呼吸開始運轉，\n喚醒身體機能，解除長年卡住的模式。\n\n當身體的重新獲得力量，結構才得以平衡，\n神經系統變的安全，情緒也會找到它的出口。",
  },
  {
    label: "相信",
    body: "身體知道它原本的狀態是什麼樣子。\n而我要做的，只是幫助你、陪伴你找回來。\n\n我相信身心有極強大的潛能。\n我也相信，最終的答案在自己身上。\n\n安全感、力量，從來不是源於外在的\n——你早已擁有，只是還沒被喚醒。",
  },
  {
    label: "啟程",
    body: "太曦邀請你一起從更深的角度認識自己。\n不管你帶著什麼故事來，這裡都接納。\n只要你準備好了，我們就一起啟程。",
  },
];

export default function About() {
  // 把 5 段切成「前 3 段 → 工作室照打斷 → 後 2 段」的節奏
  const sectionsTop = sections.slice(0, 3);
  const sectionsBottom = sections.slice(3);

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-16">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          關於
        </p>
        <h1 className="mt-6 text-4xl tracking-[0.1em] leading-snug">
          張曦昀 與 太曦
        </h1>
      </header>

      {/* 創辦人肖像——header 之後、內文之前 */}
      <div
        role="img"
        aria-label="張曦昀肖像"
        className="aspect-[4/5] mb-20 bg-rule"
        style={{
          backgroundImage: "url('/images/founder-about.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="space-y-16">
        {sectionsTop.map((section) => (
          <section key={section.label}>
            <h2 className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase mb-5">
              {section.label}
            </h2>
            <p className="text-lg leading-loose whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </div>

      {/* 工作室空間——前後段內文中間視覺呼吸 */}
      <div
        role="img"
        aria-label="工作室空間"
        className="aspect-[16/9] my-24 bg-rule"
        style={{
          backgroundImage: "url('/images/studio.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="space-y-16">
        {sectionsBottom.map((section) => (
          <section key={section.label}>
            <h2 className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase mb-5">
              {section.label}
            </h2>
            <p className="text-lg leading-loose whitespace-pre-line">{section.body}</p>
          </section>
        ))}
      </div>

      <footer className="mt-24 pt-12 border-t border-rule flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <TrackedLink
          href={LINE_BOOK_URL}
          event="book_click_about"
          className="font-sans text-xs tracking-[0.3em] uppercase bg-ink text-paper px-8 py-3 text-center hover:opacity-85 transition-opacity"
        >
          預約初次諮詢
        </TrackedLink>
        <Link
          href="/writing"
          className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors"
        >
          讀文章 →
        </Link>
      </footer>
    </article>
  );
}

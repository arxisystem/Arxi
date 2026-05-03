import Link from "next/link";
import type { Metadata } from "next";
import { TrackedLink } from "../components/TrackedLink";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export const metadata: Metadata = {
  title: "關於",
  description:
    "從數學到音樂，再到身體——張曦昀的轉折，與太曦的核心哲學。",
};

const sections = [
  {
    label: "起點",
    body: "從數學到音樂，再到身體——這條路，從外面看起來不連貫，但對曦昀來說，每一步都在找同一件事：世界的真理，以及她在其中的位置。",
  },
  {
    label: "轉折",
    body: "台大數學系畢業後，他進入巴黎 Rueil-Malmaison 音樂院深造，在音符與結構裡繼續追問。但真正讓他停下來的，是某一天他開始注意到自己的身體——那些情緒與行為模式底下，潛藏著他從未看見的創傷與人格。那是他人生的轉折點。",
  },
  {
    label: "方法論",
    body: "他開始系統性地學習：Be Activated、Body-Mind Centering、Somatic Experiencing、Applied Kinesiology、Internal Family System，目前就讀中國醫藥大學後中醫學系三年級。五年的身心整合工作，每一個個案都在加深他對「身體知道答案」這件事的信念。",
  },
  {
    label: "核心哲學",
    body: "太曦的核心，是呼吸。不是冥想式的放鬆，而是透過徒手的方式，調整呼吸的結構與動力，整合中醫陰陽與神經肌筋膜系統，讓身心重回它原本該有的狀態。安全感不是被給予的——它是身體重新找回力量之後，自然升起的。",
  },
  {
    label: "邀請",
    body: "他走過這條路，然後為準備好的人留下入口。太曦不是給所有人的——是給那些對身體感到好奇、願意用新的角度重新看見自己的人。如果你在這裡停下來，也許，你已經準備好了。",
  },
];

export default function About() {
  // 把 5 段切成「前 3 段 → 工作室照打斷 → 後 2 段」的節奏
  const sectionsTop = sections.slice(0, 3);
  const sectionsBottom = sections.slice(3);

  return (
    <article className="mx-auto max-w-2xl px-6 py-24">
      <header className="mb-16">
        <p className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase">
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
            <h2 className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-5">
              {section.label}
            </h2>
            <p className="text-lg leading-loose">{section.body}</p>
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
            <h2 className="font-sans text-xs tracking-[0.3em] text-ink-soft uppercase mb-5">
              {section.label}
            </h2>
            <p className="text-lg leading-loose">{section.body}</p>
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

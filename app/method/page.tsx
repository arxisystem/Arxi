import Link from "next/link";
import type { Metadata } from "next";
import { TrackedLink } from "../components/TrackedLink";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export const metadata: Metadata = {
  title: "太曦的方法",
  description:
    "太曦是一套以徒手工作與呼吸引導為核心的身心工作方法，陪你看見身心長期形成的張力、代償與反應方式。",
  alternates: { canonical: "/method" },
  openGraph: {
    title: "太曦的方法",
    description:
      "以徒手工作與呼吸引導為核心，重新感受身體，建立更有選擇的回應方式。",
    url: "/method",
  },
};

const process = [
  {
    numeral: "I",
    title: "看見",
    body: "先從對話與身體覺察開始，理解你此刻帶著什麼狀態而來：呼吸在哪裡卡住、哪些部位長期用力代償，以及帶你認識身體運作的方式。",
  },
  {
    numeral: "II",
    title: "調整",
    body: "藉著徒手按壓關鍵點位，解除代償、引導呼吸，讓原本斷聯的部位重新被感覺並喚醒力量，使身心回到安全，也讓過度工作的部位有機會休息。在全新的狀態下，身心將有機會獲得全新的答案",
  },
  {
    numeral: "III",
    title: "整合",
    body: "調整之後，再次觀察呼吸、動作品質、心境狀態。重點不是聚焦你遭遇的問題，而是辨認身體在跟你說什麼、多了哪些可能，並把新的狀態帶回生活、自己照顧自己。",
  },
];

export default function MethodPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 sm:py-20 md:py-24">
      <header className="mb-20">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          太曦的方法
        </p>
        <h1 className="mt-6 text-3xl sm:text-4xl tracking-[0.08em] leading-snug">
          從呼吸開始，重新認識身心
        </h1>
        <p className="mt-8 text-lg leading-loose text-ink-muted">
          太曦是一套以徒手工作與呼吸引導為核心的身心工作方法，陪你看見身體長期形成的張力、代償與反應方式，重新找回感受與選擇。
        </p>
      </header>

      <div className="space-y-24">
        <section>
          <h2 className="text-3xl tracking-[0.12em] mb-8">身體一直在說話</h2>
          <div className="space-y-6 text-lg leading-loose">
            <p>
              呼吸、姿勢、動作、情緒並不是彼此分開的。當一個人遭遇壓力，身體可能以憋氣、緊繃、退縮、代償的方式來保護自己；久而久之身心會變得僵化，甚至難察覺，最後在不知不覺中，逐漸成為身心反覆不適的一部分。
            </p>
            <p>
              太曦不急著把哪個部位「修好」，而是從身體此刻的狀態開始，理解它如何保護你、如何替你撐住，也讓它有機會經驗不同的方式。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl tracking-[0.12em] mb-10">實際怎麼進行</h2>
          <ol className="space-y-12">
            {process.map((item) => (
              <li
                key={item.numeral}
                className="grid grid-cols-[2em_1fr] gap-4 sm:gap-6"
              >
                <span className="pt-1 font-sans text-xs tracking-[0.25em] text-ink-soft">
                  {item.numeral}
                </span>
                <div>
                  <h3 className="text-xl tracking-[0.1em] mb-3">{item.title}</h3>
                  <p className="text-lg leading-loose text-ink-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-3xl tracking-[0.12em] mb-8">方法的起點與形成</h2>
          <div className="space-y-6 text-lg leading-loose">
            <p>
              太曦的方法以 Be Activated
              為最初的技術基底。這套系統讓我開始從呼吸、肌肉參與和身體的代償順序，理解一個人如何使用力量。
            </p>
            <p>
              隨著實際工作的累積，我逐漸發現，身體的反應不只和動作有關，也和安全感、情緒、感覺經驗，以及一個人面對世界的方式相連。
            </p>
            <p>
              因此，我持續吸收 Polyvagal Theory、Somatic Experiencing、Feldenkrais、Body-Mind
              Centering、Applied Kinesiology、Internal Family Systems、中醫
              等系統的觀點，再經過個案工作中的觀察與整理，逐漸形成今日的太曦。
            </p>
          </div>

        </section>

        <section>
          <h2 className="text-3xl tracking-[0.12em] mb-8">一次工作裡，你會做什麼</h2>
          <div className="space-y-6 text-lg leading-loose">
            <p>
              你不是被動地躺著等待處理。過程中，我會邀請你呼吸、做簡單動作，或描述當下感受到的變化。你不需要努力做到某個標準，只需要單純的感受。
            </p>
            <p>
              太曦的目標在於陪伴你與自身身體重新產生連結，我們不強迫你揭露內心的痛苦，也不強求過程必須產生特定結果。任何接觸與練習都可以討論、調整或暫停。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl tracking-[0.12em] mb-8">什麼時候可以來</h2>
          <p className="text-lg leading-loose mb-6">
            你不需要先替自己找到一個精確的問題。當你對以下狀態感到好奇，就可以從一次體驗開始：
          </p>
          <ul className="space-y-4 text-lg leading-loose text-ink-muted">
            <li>長期緊繃、容易疲累，卻不容易真正休息</li>
            <li>呼吸經常很淺，或壓力來時容易憋住</li>
            <li>身體總覺得痠痛緊、卡卡的，做了很多動作練習卻仍感覺不對勁</li>
            <li>想理解身體感受、情緒與行為模式之間的關係</li>
            <li>希望建立更細緻的身體覺察與自我照顧方式</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl tracking-[0.12em] mb-8">與其他方式的關係</h2>
          <div className="space-y-6 text-lg leading-loose">
            <p>
              按摩、整復、復健、心理諮商與醫療各有自己的專業目的。太曦並不試圖替代其中任何一種，而是透過呼吸、覺察與動作，邀請你對自身狀態有更深的感受，解除代償，並喚醒身心原有的力量，優化身體的使用方式。
            </p>
            <p>
              如果你正接受醫療、復健或心理治療，太曦可以在資訊充分、彼此界線清楚的前提下，以一種深刻觀點，重新帶你聽懂身體在說的話。
            </p>
          </div>
        </section>

        <section className="border-t border-rule pt-12">
          <h2 className="text-2xl tracking-[0.12em] mb-6">安全與界線</h2>
          <div className="space-y-5 text-base leading-loose text-ink-muted">
            <p>
              太曦不是醫療診斷或心理治療，也不取代必要的就醫與專業照護。急性傷害、急重症時，應先尋求合適的醫療評估。
            </p>
            <p>
              每個人的身體狀態與反應都不同，太曦要做的不是向你保證效果，而是陪伴你探索和理解自己的身體。而往往，許多深刻的改變都是發生在那些被忽略的細節中。若有特殊病史、孕期或近期手術等情況，請在預約前告知，一起確認是否適合進行。
            </p>
          </div>
        </section>
      </div>

      <footer className="mt-24 pt-12 border-t border-rule flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <TrackedLink
          href={LINE_BOOK_URL}
          event="method_book_click"
          className="font-sans text-xs tracking-[0.3em] uppercase bg-ink text-paper px-8 py-3 text-center hover:opacity-85 transition-opacity"
        >
          預約初次體驗
        </TrackedLink>
        <Link
          href="/before"
          className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors"
        >
          初次來之前 →
        </Link>
      </footer>
    </article>
  );
}

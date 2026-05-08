import type { Metadata } from "next";
import { SubscribeForm } from "./SubscribeForm";

export const metadata: Metadata = {
  title: "訂閱",
  description:
    "當有東西真正值得說的時候，你才會收到一封信——關於呼吸、身體、身心的連結。",
  alternates: { canonical: "/subscribe" },
  openGraph: {
    title: "訂閱",
    description:
      "當有東西真正值得說的時候，你才會收到一封信——關於呼吸、身體、身心的連結。",
    url: "/subscribe",
  },
};

const willGet = [
  "不定期深度文章：呼吸、結構、神經與情緒的連動",
  "曦昀的日常觀察與思考",
  "偶爾的工作室消息與名額開放通知",
];

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32">
      <header className="mb-16">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          訂閱
        </p>
        <h1 className="mt-6 text-4xl tracking-[0.1em] leading-snug">
          加入太曦
        </h1>
      </header>

      <div className="space-y-6">
        <p className="text-lg leading-loose">
          這不是每週固定更新的電子報。
        </p>
        <p className="text-lg leading-loose text-ink-muted">
          當有東西真正值得說的時候，你才會收到一封信——關於呼吸、身體運作的邏輯、身心的連結，以及一些日常的觀察與思考。免費，不打擾。
        </p>
      </div>

      <section className="mt-16 pt-12 border-t border-rule">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase mb-8">
          你會收到
        </p>
        <ul className="space-y-5">
          {willGet.map((item) => (
            <li
              key={item}
              className="text-base leading-relaxed flex gap-4 items-start"
            >
              <span className="font-sans text-xs text-ink-soft mt-2">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 pt-12 border-t border-rule">
        <SubscribeForm />
      </section>
    </div>
  );
}

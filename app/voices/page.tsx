import type { Metadata } from "next";
import { TrackedLink } from "../components/TrackedLink";
import { voices } from "@/lib/voices";

const LINE_BOOK_URL = "https://lin.ee/uotrdCX";

export const metadata: Metadata = {
  title: "回響",
  description: "他們走過這裡，留下了一些話。",
  alternates: { canonical: "/voices" },
  openGraph: {
    title: "回響",
    description: "他們走過這裡，留下了一些話。",
    url: "/voices",
  },
};

export default function VoicesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-32">
      <header className="mb-24">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase">
          回響
        </p>
        <h1 className="mt-6 text-3xl sm:text-4xl tracking-[0.05em] leading-snug">
          他們走過這裡，留下了一些話。
        </h1>
      </header>

      {voices.length === 0 ? (
        <p className="font-sans text-sm tracking-[0.2em] text-ink-soft">
          尚無回響。
        </p>
      ) : (
        <div className="space-y-32">
          {voices.map((voice) => (
            <article key={voice.id}>
              <p className="text-lg leading-loose whitespace-pre-line">
                {voice.story}
              </p>
              <p className="mt-10 font-sans text-xs tracking-[0.3em] text-ink-soft uppercase">
                {voice.name}
                <span className="mx-2">·</span>
                {voice.age}
                <span className="mx-2">·</span>
                {voice.occupation}
              </p>
              <div className="mt-12 pt-10 border-t border-rule text-center">
                <TrackedLink
                  href={LINE_BOOK_URL}
                  event="voice_book_click"
                  eventParams={{
                    voice_id: voice.id,
                    voice_name: voice.name,
                  }}
                  className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper px-10 py-4 hover:opacity-85 transition-opacity"
                >
                  預約初次體驗
                </TrackedLink>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

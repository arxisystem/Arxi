"use client";

import { useEffect } from "react";
import { TrackedLink } from "../components/TrackedLink";

const LINE_URL = "https://lin.ee/uotrdCX";
const DELAY_MS = 2500;
const GA_EVENT = "book_click_bookpage";

export function BookRedirect() {
  useEffect(() => {
    // 一進到 /book 即視為「預約意圖」——直接 fire GA 事件，不等使用者點擊
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", GA_EVENT, {
          event_category: "outbound",
          event_label: LINE_URL,
        });
      }
    } catch {
      // 失敗無傷
    }

    const t = setTimeout(() => {
      window.location.href = LINE_URL;
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-32">
      <div className="text-center max-w-md">
        <p className="font-sans text-sm tracking-[0.25em] text-ink-muted uppercase mb-12">
          預約
        </p>
        <p className="text-2xl tracking-[0.08em] leading-[1.8]">
          帶你去預約——
          <br />
          你準備好了就可以出發。
        </p>
        <p className="mt-16 font-sans text-xs tracking-[0.25em] text-ink-soft uppercase">
          正在前往 LINE 預約頁⋯
        </p>
        <noscript>
          <p className="mt-10">
            <a
              href={LINE_URL}
              className="font-sans text-sm tracking-[0.2em] underline"
            >
              點此手動前往 LINE 預約頁 →
            </a>
          </p>
        </noscript>
        <p className="mt-10">
          <TrackedLink
            href={LINE_URL}
            event={GA_EVENT}
            className="font-sans text-xs tracking-[0.25em] uppercase text-ink-muted hover:text-ink transition-colors underline"
          >
            或立即前往 →
          </TrackedLink>
        </p>
      </div>
    </div>
  );
}

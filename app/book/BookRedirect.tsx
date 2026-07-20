"use client";

import { useEffect } from "react";

const LINE_URL = "https://lin.ee/uotrdCX";
const LINE_ID = "@195cztiu";
const GA_EVENT = "book_click_bookpage";

/**
 * /book 頁——不再跳轉。直接依裝置分流：
 *   手機：一顆大按鈕，點了喚起 LINE App 加好友（最順）
 *   桌機：直接顯示官方 QR ＋ 帳號 ID（不再被丟到 LINE 的 QR 頁）
 *
 * 進頁即 fire GA「book_click_bookpage」——維持原本「到達預約頁」的指標意義，
 * Looker Studio 報表與篩選器不用改。
 */
export function BookRedirect() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", GA_EVENT, {
          event_category: "outbound",
          event_label: LINE_URL,
        });
      }
    } catch {
      // 追蹤失敗不影響頁面
    }
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16 sm:py-24 md:py-32">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-3xl tracking-[0.15em] text-ink">
          加入太曦
        </h1>
        <div
          className="mx-auto mt-6 w-40 h-px bg-gradient-to-r from-transparent via-ink-soft to-transparent"
          aria-hidden
        />
        <p className="mt-10 text-lg leading-loose">
          透過 LINE 預約初次體驗。
          <br />
          一對一、安靜、慢。
        </p>

        {/* 手機：直接喚起 LINE App */}
        <div className="mt-14 sm:hidden">
          <a
            href={LINE_URL}
            className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper px-10 py-4 hover:opacity-85 transition-opacity"
          >
            加入 LINE 好友 →
          </a>
        </div>

        {/* 桌機：直接顯示 QR，不跳轉 */}
        <div className="mt-14 hidden sm:flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/line-qr.png"
            alt="太曦 LINE 官方帳號 QR code"
            className="w-52 h-52 bg-paper p-3 border border-rule"
          />
          <p className="mt-6 font-sans text-xs tracking-[0.25em] text-ink-muted uppercase">
            手機 LINE 掃描加入
          </p>
        </div>

        {/* 兩種裝置共用的文字退路 */}
        <p className="mt-12 font-sans text-xs tracking-[0.2em] text-ink-soft">
          或在 LINE 搜尋官方帳號
          <span className="text-ink-muted">{LINE_ID}</span>
        </p>
      </div>
    </div>
  );
}

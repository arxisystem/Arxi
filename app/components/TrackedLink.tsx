"use client";

import type { ReactNode, AnchorHTMLAttributes } from "react";

// 全域宣告 gtag——GA4 script 載入後會掛在 window 上
declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "consent",
      target: string,
      params?: Record<string, unknown>,
    ) => void;
  }
}

type Props = {
  href: string;
  /** GA4 事件名稱，如 "book_click_hero"、"line_chat_click" */
  event: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">;

/**
 * 外連連結 + GA4 事件追蹤。
 *
 * 點擊時會 fire `gtag('event', <event>, { event_category: 'outbound', event_label: href })`。
 * 如果 GA 還沒載入或被擋（AdBlock），失敗無傷——連結照常開。
 */
export function TrackedLink({ href, event, children, ...rest }: Props) {
  const handleClick = () => {
    try {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", event, {
          event_category: "outbound",
          event_label: href,
        });
      }
    } catch {
      // 追蹤失敗不擋導航
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

"use client";

// Body Mirror 側邊欄。桌面固定、手機抽屜（漢堡）。
// 風格：paper 底、serif 標、ink-muted 次要文字。無 icon 強裝飾、用「✦」當區隔。

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutLink } from "./LogoutLink";

type Item = { href: string; label: string };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "今日",
    items: [
      { href: "/practice", label: "今日" },
      { href: "/practice/entry/new", label: "寫紀錄" },
      { href: "/practice/today", label: "今日練習" },
    ],
  },
  {
    title: "看見自己",
    items: [
      { href: "/practice/history", label: "歷史時間軸" },
      { href: "/practice/trends", label: "趨勢" },
      { href: "/practice/tags", label: "我的標籤" },
      { href: "/practice/body", label: "我的身體" },
    ],
  },
  {
    title: "與他人",
    items: [
      { href: "/practice/community", label: "今日的分享" },
      { href: "/practice/messages", label: "太曦的訊息" },
    ],
  },
  {
    title: "—",
    items: [{ href: "/practice/settings", label: "設定" }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) => {
    const active =
      href === "/practice"
        ? pathname === "/practice"
        : pathname?.startsWith(href);
    return [
      "block py-2 px-3 -mx-3 rounded-sm text-base transition-colors",
      active
        ? "bg-ink/5 dark:bg-ink-dark/10 text-ink dark:text-ink-dark"
        : "text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark",
    ].join(" ");
  };

  return (
    <>
      {/* 手機 hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="開啟選單"
        className="md:hidden fixed top-4 left-4 z-30 w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-paper dark:bg-paper-dark border border-rule dark:border-rule-dark rounded-sm"
      >
        <span className="block w-4 h-px bg-ink dark:bg-ink-dark" />
        <span className="block w-4 h-px bg-ink dark:bg-ink-dark" />
        <span className="block w-4 h-px bg-ink dark:bg-ink-dark" />
      </button>

      {/* 手機抽屜 backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-ink/30 z-30"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={[
          "fixed md:static top-0 left-0 h-screen md:h-auto z-40 md:z-auto",
          "w-64 md:w-56 bg-paper dark:bg-paper-dark border-r border-rule dark:border-rule-dark",
          "md:border-r overflow-y-auto",
          "transform transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="px-6 py-8">
          {/* 手機關閉 */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="關閉選單"
            className="md:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink"
          >
            ×
          </button>

          <Link
            href="/practice"
            onClick={() => setOpen(false)}
            className="block font-serif text-base tracking-[0.2em] text-ink dark:text-ink-dark"
          >
            太曦
            <span className="mx-1 text-ink-soft">｜</span>
            <span className="font-sans text-xs tracking-[0.25em] uppercase">
              Body Mirror
            </span>
          </Link>

          <nav className="mt-10 space-y-8">
            {GROUPS.map((g) => (
              <div key={g.title}>
                {g.title !== "—" && (
                  <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-ink-soft dark:text-ink-muted-dark mb-3">
                    {g.title}
                  </p>
                )}
                {g.title === "—" && (
                  <div
                    className="mb-4 w-12 h-px bg-rule dark:bg-rule-dark"
                    aria-hidden
                  />
                )}
                <ul>
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className={linkClass(it.href)}
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-rule dark:border-rule-dark">
            <LogoutLink className="block py-2 px-3 -mx-3 font-sans text-xs tracking-[0.25em] uppercase text-ink-soft dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}

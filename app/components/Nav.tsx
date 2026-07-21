"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/method", label: "方法" },
  { href: "/about", label: "關於" },
  { href: "/writing", label: "文章" },
  { href: "/voices", label: "回響" },
  { href: "/before", label: "Q&A" },
  { href: "/book", label: "預約" },
  { href: "/teaching", label: "教學" },
  { href: "/subscribe", label: "訂閱" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  // 抽屜開啟時鎖 body scroll，避免背景一起滑
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC 關閉抽屜
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="border-b border-rule relative z-40">
        <nav className="mx-auto max-w-6xl px-6 py-7 flex items-center justify-between gap-6 sm:gap-12">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.2em] text-ink"
          >
            太曦 Arxi
          </Link>

          {/* 桌面版 nav（md 以上） */}
          <ul className="hidden md:flex font-sans text-sm tracking-[0.25em] items-center gap-9 text-ink-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 手機版 hamburger（md 以下） */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="開啟選單"
            aria-expanded={open}
            className="md:hidden flex flex-col justify-center items-end gap-[6px] w-8 h-8"
          >
            <span className="block w-7 h-px bg-ink" />
            <span className="block w-7 h-px bg-ink" />
          </button>
        </nav>
      </header>

      {/* 手機版全螢幕抽屜 */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-paper md:hidden overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="選單"
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-7">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-serif text-xl tracking-[0.2em] text-ink"
            >
              太曦 Arxi
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="關閉選單"
              className="relative w-8 h-8"
            >
              <span className="absolute left-1/2 top-1/2 block w-7 h-px bg-ink -translate-x-1/2 -translate-y-1/2 rotate-45" />
              <span className="absolute left-1/2 top-1/2 block w-7 h-px bg-ink -translate-x-1/2 -translate-y-1/2 -rotate-45" />
            </button>
          </div>

          <ul className="flex flex-col items-center gap-9 pt-20 pb-16">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-2xl tracking-[0.25em] text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

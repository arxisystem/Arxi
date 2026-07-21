import Link from "next/link";

const contentLinks = [
  { href: "/method", label: "方法" },
  { href: "/voices", label: "回響" },
  { href: "/about", label: "關於" },
  { href: "/writing", label: "文章" },
  { href: "/before", label: "Q&A" },
  { href: "/teaching", label: "教學" },
  { href: "/subscribe", label: "訂閱" },
];

const desktopLinks = [
  ...contentLinks.slice(0, 5),
  { href: "/book", label: "預約" },
  ...contentLinks.slice(5),
];

export function Nav() {
  return (
    <header className="border-b border-rule relative z-40">
      <div className="mx-auto max-w-6xl px-6 py-6 md:py-7 flex items-center justify-between gap-6 sm:gap-12">
        <Link
          href="/"
          className="shrink-0 font-serif text-xl tracking-[0.2em] text-ink"
        >
          太曦 Arxi
        </Link>

        {/* 桌面版完整導覽 */}
        <nav aria-label="主要導覽" className="hidden md:block">
          <ul className="flex font-sans text-sm tracking-[0.25em] items-center gap-9 text-ink-muted">
            {desktopLinks.map((link) => (
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
        </nav>

        {/* 手機版固定顯示預約入口 */}
        <Link
          href="/book"
          className="md:hidden shrink-0 font-sans text-xs tracking-[0.25em] text-ink border-b border-rule pb-1"
        >
          預約
        </Link>
      </div>

      {/* 手機版橫向內容導覽；右側漸層提示仍可繼續滑動 */}
      <div className="relative border-t border-rule md:hidden">
        <nav
          aria-label="內容導覽"
          className="overflow-x-auto scrollbar-hide px-6"
        >
          <ul className="flex w-max items-center gap-8 py-4 pr-12 font-sans text-sm tracking-[0.2em] text-ink-muted">
            {contentLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className="block py-1 hover:text-ink transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-transparent"
        />
      </div>
    </header>
  );
}

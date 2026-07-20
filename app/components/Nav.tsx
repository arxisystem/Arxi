import Link from "next/link";

const navLinks = [
  { href: "/about", label: "關於" },
  { href: "/writing", label: "文章" },
  { href: "/voices", label: "回響" },
  { href: "/before", label: "Q&A" },
  { href: "/book", label: "預約" },
  { href: "/teaching", label: "教學" },
  { href: "/subscribe", label: "訂閱" },
];

export function Nav() {
  return (
    <header className="border-b border-rule">
      <nav className="mx-auto max-w-6xl px-6 py-7 flex items-center justify-between gap-6 sm:gap-12">
        <Link
          href="/"
          className="font-serif text-xl tracking-[0.2em] text-ink"
        >
          太曦 Arxi
        </Link>
        <ul className="font-sans text-sm tracking-[0.25em] flex items-center gap-5 sm:gap-9 text-ink-muted">
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
      </nav>
    </header>
  );
}

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule mt-32">
      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 font-sans text-sm tracking-[0.2em] text-ink-muted">
        <div className="font-serif text-base tracking-[0.25em] text-ink">
          太曦 Arxi
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/subscribe"
            className="hover:text-ink transition-colors"
          >
            訂閱
          </Link>
          <span>© {year} 太曦</span>
        </div>
      </div>
    </footer>
  );
}

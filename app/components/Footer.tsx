import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-paper mt-32">
      <div className="mx-auto max-w-6xl px-6 py-20 flex flex-col items-center text-center gap-10 font-sans">
        <div className="font-serif font-semibold text-2xl tracking-[0.15em]">
          太曦 Arxi
        </div>

        <div className="flex flex-col items-center gap-4 text-base tracking-[0.15em]">
          <Link
            href="/subscribe"
            className="no-underline hover:opacity-60 transition-opacity"
          >
            訂閱
          </Link>
          <a
            href="https://instagram.com/arxi.system"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline hover:opacity-60 transition-opacity"
          >
            Instagram　@arxi.system
          </a>
          <a
            href="mailto:arxi.system@gmail.com"
            className="no-underline hover:opacity-60 transition-opacity"
          >
            合作邀請　arxi.system@gmail.com
          </a>
        </div>

        <div className="text-[11px] tracking-[0.25em] opacity-50 mt-4">
          © 2026 太曦
        </div>
      </div>
    </footer>
  );
}

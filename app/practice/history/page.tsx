// 歷史時間軸。列出客戶所有自己的 entries。
// 預設「過去 30 天」、可由 query string `?range=7|30|90|all` 切換。
// TODO: 之後可加 tag 篩選、文字搜尋。

import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EntryRow } from "@/app/components/bodymirror/EntryRow";

const RANGES = [
  { key: "7", label: "近 7 天", days: 7 },
  { key: "30", label: "近 30 天", days: 30 },
  { key: "90", label: "近 90 天", days: 90 },
  { key: "all", label: "全部", days: null },
] as const;

type PageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function HistoryPage({ searchParams }: PageProps) {
  const { range = "30" } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) return null;

  const found = RANGES.find((r) => r.key === range) ?? RANGES[1];

  const where: { userId: string; entryDate?: { gte: Date } } = {
    userId: session.user.id,
  };
  if (found.days) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - found.days);
    where.entryDate = { gte: since };
  }

  const entries = await db.entry.findMany({
    where,
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      entryDate: true,
      breathValue: true,
      bodyValue: true,
      presenceValue: true,
      notesShape: true,
      notesMoment: true,
      entryTags: { include: { tag: { select: { name: true } } } },
    },
  });

  const localToday = new Date();
  const localTodayMs = new Date(
    localToday.getFullYear(),
    localToday.getMonth(),
    localToday.getDate(),
  ).getTime();

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          歷史時間軸
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          你過去的紀錄
        </h1>
      </header>

      {/* 時間範圍切換 */}
      <nav className="mt-8 flex flex-wrap gap-3 font-sans text-xs tracking-[0.2em]">
        {RANGES.map((r) => {
          const active = r.key === found.key;
          return (
            <Link
              key={r.key}
              href={`/practice/history?range=${r.key}`}
              className={
                "px-3 py-1.5 border " +
                (active
                  ? "bg-ink/5 dark:bg-ink-dark/10 border-ink/40 text-ink dark:text-ink-dark"
                  : "border-ink/15 text-ink-muted hover:text-ink hover:border-ink/30")
              }
            >
              {r.label}
            </Link>
          );
        })}
      </nav>

      <section className="mt-10">
        {entries.length === 0 ? (
          <p className="text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
            這個區間還沒有紀錄。
          </p>
        ) : (
          <div className="space-y-1">
            {entries.map((e) => (
              <EntryRow key={e.id} entry={e} todayMs={localTodayMs} />
            ))}
          </div>
        )}
      </section>
    </article>
  );
}

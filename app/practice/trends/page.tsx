// 趨勢頁——三條折線 + tag 頻次清單。

import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TrendChart } from "@/app/components/bodymirror/TrendChart";

const RANGES = [
  { key: "7", label: "近 7 天", days: 7 },
  { key: "30", label: "近 30 天", days: 30 },
  { key: "90", label: "近 90 天", days: 90 },
] as const;

type PageProps = {
  searchParams: Promise<{ range?: string }>;
};

export default async function TrendsPage({ searchParams }: PageProps) {
  const { range = "30" } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) return null;

  const found = RANGES.find((r) => r.key === range) ?? RANGES[1];
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - found.days);

  const entries = await db.entry.findMany({
    where: { userId: session.user.id, entryDate: { gte: since } },
    orderBy: [{ entryDate: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      entryDate: true,
      breathValue: true,
      bodyValue: true,
      presenceValue: true,
      entryTags: { include: { tag: { select: { name: true } } } },
    },
  });

  // 同一日多筆只取最後一筆
  const trendByDate = new Map<
    number,
    { date: Date; breath: number | null; body: number | null; presence: number | null }
  >();
  for (const e of entries) {
    trendByDate.set(e.entryDate.getTime(), {
      date: e.entryDate,
      breath: e.breathValue,
      body: e.bodyValue,
      presence: e.presenceValue,
    });
  }
  const points = Array.from(trendByDate.values());

  // tag 頻次（這個區間）
  const tagCount = new Map<string, number>();
  for (const e of entries) {
    for (const et of e.entryTags) {
      tagCount.set(et.tag.name, (tagCount.get(et.tag.name) ?? 0) + 1);
    }
  }
  const tagRanked = Array.from(tagCount.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          趨勢
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          {found.label}的身體
        </h1>
      </header>

      {/* 時間範圍切換 */}
      <nav className="mt-8 flex flex-wrap gap-3 font-sans text-xs tracking-[0.2em]">
        {RANGES.map((r) => {
          const active = r.key === found.key;
          return (
            <Link
              key={r.key}
              href={`/practice/trends?range=${r.key}`}
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
        <TrendChart points={points} />
      </section>

      {/* tag 頻次 */}
      <section className="mt-16">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark mb-5">
          這個區間最常出現的
        </p>
        {tagRanked.length === 0 ? (
          <p className="text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
            還沒標記過 tag。
          </p>
        ) : (
          <ul className="space-y-2">
            {tagRanked.map(([name, count]) => (
              <li key={name} className="flex items-baseline gap-4">
                <span className="font-serif text-base">{name}</span>
                <span className="font-sans text-sm tabular-nums text-ink-muted dark:text-ink-muted-dark">
                  {count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

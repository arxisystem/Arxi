// 我的標籤——所有用過的 tag、出現次數、分組顯示。
// 之後可加：點 tag → 篩出對應 entries（連到 /practice/history?tag=xxx）。

import { auth } from "@/auth";
import { db } from "@/lib/db";

const GROUPS = [
  { category: "BODY_LOCATION", label: "身體部位" },
  { category: "BREATH_QUALITY", label: "呼吸品質" },
  { category: "STATE", label: "狀態" },
] as const;

export default async function TagsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 撈所有出現過的 (tag, count)
  const grouped = await db.entryTag.groupBy({
    by: ["tagId"],
    where: { entry: { userId: session.user.id } },
    _count: { tagId: true },
  });

  const counts = new Map<string, number>();
  for (const g of grouped) counts.set(g.tagId, g._count.tagId);

  const allTags = await db.tag.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          我的標籤
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          你最常標記的
        </h1>
      </header>

      <div className="mt-10 space-y-12">
        {GROUPS.map((g) => {
          const tags = allTags
            .filter((t) => t.category === g.category)
            .map((t) => ({ ...t, count: counts.get(t.id) ?? 0 }))
            .sort((a, b) => b.count - a.count);
          return (
            <section key={g.category}>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark mb-5">
                {g.label}
              </p>
              <ul className="space-y-2">
                {tags.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-baseline gap-4 border-b border-rule/40 dark:border-rule-dark/40 py-2"
                  >
                    <span className="font-serif text-base flex-1">{t.name}</span>
                    <span className="font-sans text-sm tabular-nums text-ink-muted dark:text-ink-muted-dark">
                      {t.count > 0 ? t.count : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}

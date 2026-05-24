// 我的身體——身體部位（BODY_LOCATION）出現頻次特寫。
// 跟 /tags 的差別：這頁只聚焦「身體部位」、加一些解讀提示。
// TODO: 可加身體部位視覺地圖（靜態人形圖、熱區），目前先用清單。

import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function BodyPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const grouped = await db.entryTag.groupBy({
    by: ["tagId"],
    where: {
      entry: { userId: session.user.id },
      tag: { category: "BODY_LOCATION" },
    },
    _count: { tagId: true },
  });

  const counts = new Map<string, number>();
  for (const g of grouped) counts.set(g.tagId, g._count.tagId);

  const allBody = await db.tag.findMany({
    where: { category: "BODY_LOCATION", active: true },
    orderBy: { order: "asc" },
  });

  const ranked = allBody
    .map((t) => ({ ...t, count: counts.get(t.id) ?? 0 }))
    .sort((a, b) => b.count - a.count);

  const total = ranked.reduce((s, t) => s + t.count, 0);

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          我的身體
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          身體最常被你看見的部位
        </h1>
      </header>

      <section className="mt-10">
        {total === 0 ? (
          <p className="text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
            還沒在 entries 裡標記過身體部位。
          </p>
        ) : (
          <ul className="space-y-4">
            {ranked.map((t) => {
              const pct = total ? (t.count / total) * 100 : 0;
              return (
                <li key={t.id}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-base flex-1">{t.name}</span>
                    <span className="font-sans text-sm tabular-nums text-ink-muted dark:text-ink-muted-dark">
                      {t.count}
                    </span>
                  </div>
                  {/* 比例細條——視覺感受、無絕對數字焦慮 */}
                  <div className="mt-1.5 h-px bg-rule dark:bg-rule-dark relative">
                    <div
                      className="absolute left-0 top-0 h-px bg-ink dark:bg-ink-dark"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <p className="mt-12 font-sans text-xs tracking-[0.15em] text-ink-soft dark:text-ink-muted-dark leading-loose">
        身體哪個部位最常出現在你的紀錄裡，
        <br />
        往往就是它最想被你看見的時候。
      </p>
    </article>
  );
}

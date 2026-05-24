// 今日的分享——其他客戶今日分享的 entries（匿名）。
// 排除自己的。

import { auth } from "@/auth";
import { db } from "@/lib/db";

function todayUtcDate(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export default async function CommunityPage() {
  const session = await auth();
  const today = todayUtcDate();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const todayShares = await db.entry.findMany({
    where: {
      shareWithCommunity: true,
      entryDate: { gte: today, lt: tomorrow },
      userId: { not: session?.user?.id ?? "" },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      notesShape: true,
      notesMoment: true,
      entryTags: { include: { tag: { select: { name: true } } } },
    },
    take: 30,
  });

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          今日的分享
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          其他人今天留下的話
        </h1>
        <p className="mt-4 font-sans text-xs tracking-[0.15em] text-ink-soft dark:text-ink-muted-dark leading-relaxed">
          匿名顯示，不會出現名字。
          <br />
          想分享自己的，在寫 entry 時勾「也讓其他個案匿名看到」。
        </p>
      </header>

      <section className="mt-12">
        {todayShares.length === 0 ? (
          <p className="text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
            今天還沒有人分享。
          </p>
        ) : (
          <ul className="space-y-10">
            {todayShares.map((s) => {
              const notes = s.notesShape || s.notesMoment;
              const tagNames = s.entryTags.map((et) => et.tag.name);
              return (
                <li key={s.id}>
                  {notes ? (
                    <p className="font-serif text-lg leading-loose whitespace-pre-line">
                      {notes}
                    </p>
                  ) : (
                    <p className="font-serif text-lg leading-loose text-ink-muted dark:text-ink-muted-dark italic">
                      （未留文字、只標記了身體狀態）
                    </p>
                  )}
                  {tagNames.length > 0 && (
                    <p className="mt-3 font-sans text-xs tracking-[0.15em] text-ink-muted dark:text-ink-muted-dark">
                      {tagNames.join(" · ")}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}

// 太曦的訊息——目前等於「太曦指派過的所有練習」歷史。
// 之後可加 admin 寫給 client 的觀察筆記（要新 schema）。

import { auth } from "@/auth";
import { db } from "@/lib/db";

function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}.${String(m).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
}

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const practices = await db.practice.findMany({
    where: { userId: session.user.id },
    orderBy: { assignedDate: "desc" },
    take: 50,
  });

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          太曦的訊息
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          太曦指派給你的練習
        </h1>
      </header>

      <section className="mt-10">
        {practices.length === 0 ? (
          <p className="text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
            太曦還沒指派任何練習。
            <br />
            通常會在 session 中或 session 後出現。
          </p>
        ) : (
          <ul className="space-y-8">
            {practices.map((p) => (
              <li
                key={p.id}
                className="border-b border-rule/40 dark:border-rule-dark/40 pb-6 last:border-b-0"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-xs tracking-[0.25em] text-ink-muted dark:text-ink-muted-dark">
                    {fmtDate(p.assignedDate)}
                  </span>
                  <span className="font-sans text-xs tracking-[0.2em] text-ink-soft dark:text-ink-muted-dark">
                    {practiceTypeLabel(p.type)}
                  </span>
                  {p.completedAt && (
                    <span className="font-sans text-xs tracking-[0.2em] text-ink dark:text-ink-dark">
                      已完成
                    </span>
                  )}
                </div>
                <p className="mt-3 font-serif text-lg leading-relaxed">{p.title}</p>
                {p.description && (
                  <p className="mt-2 text-base leading-loose whitespace-pre-line text-ink-muted dark:text-ink-muted-dark">
                    {p.description}
                  </p>
                )}
                {p.durationMin && (
                  <p className="mt-2 font-sans text-xs tracking-[0.15em] text-ink-soft">
                    約 {p.durationMin} 分鐘
                  </p>
                )}
                {p.completionNote && (
                  <p className="mt-3 pl-4 border-l-2 border-rule italic text-sm leading-relaxed text-ink-muted dark:text-ink-muted-dark whitespace-pre-line">
                    {p.completionNote}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

function practiceTypeLabel(t: string): string {
  switch (t) {
    case "BREATH":
      return "呼吸";
    case "OBSERVATION":
      return "身體觀察";
    case "MOVEMENT":
      return "動作";
    case "STILLNESS":
      return "靜坐";
    case "STRETCH":
      return "伸展";
    default:
      return t;
  }
}

// Admin 客戶 detail。spec §10.2 + v2 升級。
// 本頁太曦看：基本資料 / 30 日趨勢 / 平均 / tag 頻次 / 身體部位頻次 / 最近 entries（依 shareWithAdmin）/ 已指派練習。
// admin 端可以顯示數字（鐵則 1 是給客戶端的）。

import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { TrendChart } from "@/app/components/bodymirror/TrendChart";
import { ClientActionButton } from "@/app/admin/ClientActionButton";

function fmtDate(d: Date | null | undefined): string {
  if (!d) return "—";
  const x = new Date(d);
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, "0")}.${String(x.getDate()).padStart(2, "0")}`;
}

function avg(nums: (number | null)[]): number | null {
  const xs = nums.filter((n): n is number => typeof n === "number");
  if (xs.length === 0) return null;
  return xs.reduce((s, n) => s + n, 0) / xs.length;
}

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminClientPage({ params }: PageProps) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;

  const { id } = await params;

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      defaultShareWithAdmin: true,
      defaultShareWithCommunity: true,
    },
  });
  if (!user) notFound();

  // 過去 30 天 entries（趨勢、平均、tag freq 用）
  const today = new Date();
  const thirtyAgo = new Date(today.getTime() - 30 * 24 * 3600 * 1000);

  const entries30 = await db.entry.findMany({
    where: { userId: id, entryDate: { gte: thirtyAgo } },
    orderBy: [{ entryDate: "asc" }, { createdAt: "asc" }],
    include: {
      entryTags: { include: { tag: true } },
    },
  });

  // 趨勢點（同一日多筆取最後）
  const trendByDate = new Map<
    number,
    { date: Date; breath: number | null; body: number | null; presence: number | null }
  >();
  for (const e of entries30) {
    trendByDate.set(e.entryDate.getTime(), {
      date: e.entryDate,
      breath: e.breathValue,
      body: e.bodyValue,
      presence: e.presenceValue,
    });
  }
  const trendPoints = Array.from(trendByDate.values());

  // 30 日平均
  const breathAvg = avg(entries30.map((e) => e.breathValue));
  const bodyAvg = avg(entries30.map((e) => e.bodyValue));
  const presenceAvg = avg(entries30.map((e) => e.presenceValue));

  // tag 頻次（含身體部位 / 呼吸品質 / 狀態）
  const tagFreq = new Map<string, { name: string; category: string; count: number }>();
  for (const e of entries30) {
    for (const et of e.entryTags) {
      const k = et.tag.name;
      const cur = tagFreq.get(k) ?? { name: et.tag.name, category: et.tag.category, count: 0 };
      cur.count += 1;
      tagFreq.set(k, cur);
    }
  }
  const tagRanked = Array.from(tagFreq.values()).sort((a, b) => b.count - a.count);
  const bodyTags = tagRanked.filter((t) => t.category === "BODY_LOCATION");
  const otherTags = tagRanked.filter((t) => t.category !== "BODY_LOCATION");

  // body direction tags（v2 新欄位）頻次
  const dirFreq = new Map<string, number>();
  for (const e of entries30) {
    for (const t of e.bodyDirectionTags) {
      dirFreq.set(t, (dirFreq.get(t) ?? 0) + 1);
    }
  }
  const dirRanked = Array.from(dirFreq.entries()).sort((a, b) => b[1] - a[1]);

  // 最近 entries（只顯示 shareWithAdmin=true 的內容；其他只列出日期）
  const recentEntries = await db.entry.findMany({
    where: { userId: id },
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
    take: 14,
    select: {
      id: true,
      entryDate: true,
      shareWithAdmin: true,
      breathValue: true,
      bodyValue: true,
      presenceValue: true,
      notesShape: true,
      notesMoment: true,
      bodyDirectionTags: true,
      entryTags: { include: { tag: true } },
    },
  });

  // 最近指派的練習
  const recentPractices = await db.practice.findMany({
    where: { userId: id },
    orderBy: { assignedDate: "desc" },
    take: 5,
  });

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <Link
          href="/admin"
          className="font-sans text-xs tracking-[0.25em] uppercase text-ink-muted hover:text-ink"
        >
          ← 回客戶清單
        </Link>
        <h1 className="mt-6 font-serif text-2xl sm:text-3xl tracking-[0.1em]">
          {user.name ?? "（無名）"}
        </h1>
        <p className="mt-3 font-sans text-sm tracking-[0.15em] text-ink-muted">
          {user.email}
        </p>
        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Field label="狀態" value={user.status} />
          <Field label="加入" value={fmtDate(user.createdAt)} />
          <Field label="預設分享給太曦" value={user.defaultShareWithAdmin ? "是" : "否"} />
          <Field label="預設社群分享" value={user.defaultShareWithCommunity ? "是" : "否"} />
        </dl>

        {/* 狀態變更按鈕 */}
        <div className="mt-5 flex flex-wrap gap-2">
          {user.status === "ACTIVE" && (
            <ClientActionButton userId={user.id} action="PAUSE" label="暫停" variant="ghost" />
          )}
          {user.status === "PAUSED" && (
            <ClientActionButton
              userId={user.id}
              action="REACTIVATE"
              label="重新啟用"
              variant="ghost"
            />
          )}
          {(user.status === "PAUSED" || user.status === "ACTIVE") && (
            <ClientActionButton
              userId={user.id}
              action="ARCHIVE"
              label="封存"
              variant="danger"
              confirmText="確定封存？"
            />
          )}
        </div>
      </header>

      <Hr />

      {/* 30 日趨勢 */}
      <section>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-5">
          過去 30 天趨勢
        </p>
        <TrendChart points={trendPoints} />
        <dl className="mt-6 grid grid-cols-3 gap-4 text-sm font-sans">
          <Field label="呼吸平均" value={breathAvg?.toFixed(1) ?? "—"} />
          <Field label="身體平均" value={bodyAvg?.toFixed(1) ?? "—"} />
          <Field label="存在感平均" value={presenceAvg?.toFixed(1) ?? "—"} />
        </dl>
      </section>

      <Hr />

      {/* tag 頻次：身體部位 vs 其他 */}
      <section>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-5">
          過去 30 天 tag 頻次
        </p>
        <div className="grid sm:grid-cols-2 gap-10">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-ink-soft mb-3">身體部位</p>
            {bodyTags.length === 0 ? (
              <p className="text-sm text-ink-muted">—</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {bodyTags.map((t) => (
                  <li key={t.name} className="flex items-baseline gap-4">
                    <span className="font-serif flex-1">{t.name}</span>
                    <span className="tabular-nums text-ink-muted">{t.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="font-sans text-xs tracking-[0.2em] text-ink-soft mb-3">
              呼吸品質 / 狀態
            </p>
            {otherTags.length === 0 ? (
              <p className="text-sm text-ink-muted">—</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {otherTags.map((t) => (
                  <li key={t.name} className="flex items-baseline gap-4">
                    <span className="font-serif flex-1">{t.name}</span>
                    <span className="tabular-nums text-ink-muted">{t.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* v2: 身體傾向 (bodyDirectionTags) */}
      {dirRanked.length > 0 && (
        <>
          <Hr />
          <section>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-5">
              身體傾向（陰陽 / 方向）
            </p>
            <ul className="space-y-1.5 text-sm">
              {dirRanked.map(([name, count]) => (
                <li key={name} className="flex items-baseline gap-4">
                  <span className="font-serif flex-1">{name}</span>
                  <span className="tabular-nums text-ink-muted">{count}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Hr />

      {/* 最近 entries */}
      <section>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-5">
          最近 14 筆 entries
        </p>
        {recentEntries.length === 0 ? (
          <p className="text-sm text-ink-muted">沒有任何紀錄。</p>
        ) : (
          <ul className="space-y-6">
            {recentEntries.map((e) => (
              <li
                key={e.id}
                className="border-b border-rule/40 pb-4 last:border-b-0"
              >
                <div className="flex flex-wrap items-baseline gap-3 font-sans text-xs tracking-[0.2em] text-ink-muted">
                  <span>{fmtDate(e.entryDate)}</span>
                  <span>
                    呼吸 {e.breathValue ?? "—"} · 身體 {e.bodyValue ?? "—"} · 存在{" "}
                    {e.presenceValue ?? "—"}
                  </span>
                  {!e.shareWithAdmin && (
                    <span className="text-ink-soft">未分享（內容隱藏）</span>
                  )}
                </div>
                {e.shareWithAdmin && (
                  <>
                    {e.entryTags.length > 0 && (
                      <p className="mt-2 font-sans text-xs text-ink-muted">
                        {e.entryTags.map((et) => et.tag.name).join(" · ")}
                      </p>
                    )}
                    {e.bodyDirectionTags.length > 0 && (
                      <p className="mt-1 font-sans text-xs text-ink-soft">
                        傾向：{e.bodyDirectionTags.join(" · ")}
                      </p>
                    )}
                    {(e.notesShape || e.notesMoment) && (
                      <div className="mt-2 text-sm leading-relaxed text-ink whitespace-pre-line">
                        {e.notesShape && <p>{e.notesShape}</p>}
                        {e.notesMoment && (
                          <p className="mt-2 text-ink-muted">{e.notesMoment}</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <Hr />

      {/* 已指派練習 */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted">
            最近指派的練習
          </p>
          <Link
            href={`/admin/client/${user.id}/practice/new`}
            className="font-sans text-xs tracking-[0.2em] uppercase text-ink-muted hover:text-ink border-b border-rule pb-0.5"
          >
            + 新增指派
          </Link>
        </div>
        {recentPractices.length === 0 ? (
          <p className="text-sm text-ink-muted">還沒指派過任何練習。</p>
        ) : (
          <ul className="space-y-3 text-sm">
            {recentPractices.map((p) => (
              <li key={p.id} className="flex flex-wrap items-baseline gap-3">
                <span className="font-sans text-xs tracking-[0.2em] text-ink-muted">
                  {fmtDate(p.assignedDate)}
                </span>
                <span className="font-serif flex-1">{p.title}</span>
                <span className="font-sans text-xs text-ink-soft">
                  {p.completedAt ? "✓ 完成" : "未完成"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Hr />

      {/* 引導 / 回饋 / 週回顧 ── 下一批要做的入口（先放 placeholder） */}
      <section>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-5">
          其他（之後上線）
        </p>
        <ul className="space-y-2 text-sm text-ink-muted">
          <li>· 指派今日引導 — 下一波</li>
          <li>· 寫 entry 回饋 — 下一波</li>
          <li>· 下次會談前摘要 — 下一波</li>
        </ul>
      </section>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-sans text-xs tracking-[0.2em] text-ink-soft mb-1">{label}</dt>
      <dd className="font-serif text-base">{value}</dd>
    </div>
  );
}

function Hr() {
  return <div className="my-10 h-px bg-rule/60" />;
}

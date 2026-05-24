// /practice 「今日」頁。簡潔：早安 + 今日紀錄狀態 + 今日練習摘要。
// 其他內容（趨勢、過去、社群、標籤、身體…）都搬到自己的 nav 頁面。

import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EntryRow } from "@/app/components/bodymirror/EntryRow";

function timeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "早安";
  if (hour < 18) return "午安";
  return "晚安";
}

function todayUtcDate(): Date {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

export default async function PracticeTodayPage() {
  const session = await auth();
  const name = session?.user?.name ?? "你";

  const today = todayUtcDate();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const userId = session?.user?.id ?? "";

  // 今天的 entry（最後一筆當代表）
  const todayEntry = userId
    ? await db.entry.findFirst({
        where: { userId, entryDate: { gte: today, lt: tomorrow } },
        orderBy: { createdAt: "desc" },
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
      })
    : null;

  // 今天的 Practice（一筆）
  const todayPractice = userId
    ? await db.practice.findFirst({
        where: {
          userId,
          assignedDate: { gte: today, lt: tomorrow },
        },
        orderBy: { createdAt: "desc" },
      })
    : null;

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
          今日
        </p>
        <h1 className="mt-6 font-serif text-2xl sm:text-3xl tracking-[0.1em] leading-relaxed">
          {timeGreeting()},{" "}
          <span className="text-ink dark:text-ink-dark">{name}</span>。
        </h1>
      </header>

      {/* 今日紀錄 / 開始記錄 */}
      <section className="mt-10">
        {todayEntry ? (
          <div>
            <p className="text-lg leading-loose text-ink-muted dark:text-ink-muted-dark mb-6">
              今天已經停下來看了一下自己。
            </p>
            <EntryRow entry={todayEntry} todayMs={localTodayMs} />
            <div className="mt-6">
              <Link
                href="/practice/entry/new"
                className="inline-block font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark border-b border-rule dark:border-rule-dark pb-1"
              >
                再寫一篇
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-lg leading-loose">今天身體怎麼樣？</p>
            <div className="mt-6">
              <Link
                href="/practice/entry/new"
                className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark px-10 py-4 hover:opacity-85 transition-opacity"
              >
                開始記錄
              </Link>
            </div>
          </div>
        )}
      </section>

      <Divider />

      {/* 今日練習 */}
      <section className="mt-12">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          今日練習
        </p>
        {todayPractice ? (
          <div className="mt-5">
            <p className="text-lg leading-relaxed">{todayPractice.title}</p>
            {todayPractice.durationMin && (
              <p className="mt-1 font-sans text-xs tracking-[0.2em] text-ink-soft">
                約 {todayPractice.durationMin} 分鐘
              </p>
            )}
            <Link
              href="/practice/today"
              className="inline-block mt-4 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink border-b border-rule pb-1"
            >
              {todayPractice.completedAt ? "看詳情" : "開始"}
            </Link>
          </div>
        ) : (
          <p className="mt-5 text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
            太曦今天沒指派練習。
            <br />
            可以自己選一件事停下來。
          </p>
        )}
      </section>
    </article>
  );
}

function Divider() {
  return (
    <div
      className="mt-12 w-16 h-px bg-gradient-to-r from-ink-soft to-transparent dark:from-ink-muted-dark"
      aria-hidden
    />
  );
}

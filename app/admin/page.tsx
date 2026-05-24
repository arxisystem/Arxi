// Admin 客戶清單 server page。
// 抓全部 user + 每人最後 entry 日期 + 分享過幾篇，傳給 client component 做搜尋過濾。

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LogoutLink } from "@/app/components/bodymirror/LogoutLink";
import { AdminClientsList, type ClientRow } from "./AdminClientsList";

export default async function AdminPage() {
  const session = await auth();
  const name = session?.user?.name ?? "太曦";

  const users = await db.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      entries: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
      _count: {
        select: {
          entries: { where: { shareWithAdmin: true } },
        },
      },
    },
  });

  const clients: ClientRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    status: u.status,
    createdAt: u.createdAt.toISOString(),
    lastEntryAt: u.entries[0]?.createdAt.toISOString() ?? null,
    sharedCount: u._count.entries,
  }));

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-soft dark:text-ink-muted-dark">
          太曦｜Body Mirror　Admin
        </p>
        <h1 className="mt-8 font-serif text-2xl sm:text-3xl tracking-[0.1em] leading-relaxed">
          {name}，
        </h1>
      </header>

      <div
        className="mt-8 w-16 h-px bg-gradient-to-r from-ink-soft to-transparent dark:from-ink-muted-dark"
        aria-hidden
      />

      <div className="mt-10">
        <AdminClientsList clients={clients} />
      </div>

      <div className="mt-24 pt-8 border-t border-rule dark:border-rule-dark text-center">
        <LogoutLink />
      </div>
    </article>
  );
}

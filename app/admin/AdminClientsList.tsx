"use client";

// Admin 客戶清單——加搜尋框、即時過濾。
// 接 server 抓好的全部 user 資料、client side 依名字/email 過濾。
// 簡單做法：list size 不會大（< 數十人），client side 完全夠用。

import { useState, useMemo } from "react";
import Link from "next/link";
import { ClientActionButton } from "./ClientActionButton";

type Status = "PENDING" | "ACTIVE" | "PAUSED" | "ARCHIVED";

export type ClientRow = {
  id: string;
  name: string | null;
  email: string;
  status: Status;
  createdAt: string; // ISO string（從 server pass 過來要 serializable）
  lastEntryAt: string | null;
  sharedCount: number;
};

type Props = { clients: ClientRow[] };

function fmtRel(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.round(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      (24 * 3600 * 1000),
  );
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function AdminClientsList({ clients }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) => {
      return (
        (c.name && c.name.toLowerCase().includes(term)) ||
        c.email.toLowerCase().includes(term)
      );
    });
  }, [q, clients]);

  const pending = filtered.filter((c) => c.status === "PENDING");
  const active = filtered.filter((c) => c.status === "ACTIVE");
  const paused = filtered.filter((c) => c.status === "PAUSED");
  const archived = filtered.filter((c) => c.status === "ARCHIVED");

  return (
    <>
      {/* 搜尋框 */}
      <div className="mb-12">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋客戶名稱或 email⋯"
          className="w-full bg-transparent border-b border-rule dark:border-rule-dark py-3 text-base focus:outline-none focus:border-ink dark:focus:border-ink-dark"
        />
        {q && (
          <p className="mt-2 font-sans text-xs tracking-[0.15em] text-ink-soft">
            找到 {filtered.length} 筆
          </p>
        )}
      </div>

      {/* 待開通 */}
      <Section title={`待開通 (${pending.length})`}>
        {pending.length === 0 ? (
          <EmptyNote>{q ? "沒有符合的待開通申請。" : "沒有待開通的申請。"}</EmptyNote>
        ) : (
          <ul className="space-y-4">
            {pending.map((u) => (
              <li
                key={u.id}
                className="flex flex-wrap items-baseline gap-3 py-3 border-b border-rule/40 dark:border-rule-dark/40 last:border-b-0"
              >
                <span className="font-serif text-base">{u.name ?? "（無名）"}</span>
                <span className="font-sans text-xs tracking-[0.15em] text-ink-muted dark:text-ink-muted-dark">
                  {u.email}
                </span>
                <span className="font-sans text-xs text-ink-soft">
                  {fmtRel(u.createdAt)}申請
                </span>
                <div className="ml-auto flex gap-2">
                  <ClientActionButton
                    userId={u.id}
                    action="APPROVE"
                    label="開通"
                    variant="primary"
                  />
                  <ClientActionButton
                    userId={u.id}
                    action="REJECT"
                    label="拒絕"
                    variant="danger"
                    confirmText="確定拒絕？此 user 會被封存。"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* 活躍 */}
      <Section title={`活躍客戶 (${active.length})`}>
        {active.length === 0 ? (
          <EmptyNote>{q ? "沒有符合的活躍客戶。" : "還沒有活躍客戶。"}</EmptyNote>
        ) : (
          <ul className="space-y-4">
            {active.map((u) => (
              <li
                key={u.id}
                className="flex flex-wrap items-baseline gap-3 py-3 border-b border-rule/40 dark:border-rule-dark/40 last:border-b-0"
              >
                <Link
                  href={`/admin/client/${u.id}`}
                  className="font-serif text-base hover:text-ink-muted underline underline-offset-4 decoration-rule"
                >
                  {u.name ?? "（無名）"}
                </Link>
                <span className="font-sans text-xs tracking-[0.15em] text-ink-soft">
                  {u.email}
                </span>
                <span className="font-sans text-xs text-ink-muted">
                  最後 entry：{fmtRel(u.lastEntryAt)}
                </span>
                <span className="font-sans text-xs text-ink-muted">
                  {u.sharedCount > 0 ? `分享過 ${u.sharedCount} 篇` : "未分享"}
                </span>
                <div className="ml-auto flex gap-2">
                  <ClientActionButton userId={u.id} action="PAUSE" label="暫停" variant="ghost" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* 暫停 */}
      {paused.length > 0 && (
        <Section title={`暫停 (${paused.length})`}>
          <ul className="space-y-4">
            {paused.map((u) => (
              <li
                key={u.id}
                className="flex flex-wrap items-baseline gap-3 py-3 border-b border-rule/40 dark:border-rule-dark/40 last:border-b-0 opacity-70"
              >
                <Link
                  href={`/admin/client/${u.id}`}
                  className="font-serif text-base hover:text-ink-muted underline underline-offset-4 decoration-rule"
                >
                  {u.name ?? "（無名）"}
                </Link>
                <span className="font-sans text-xs tracking-[0.15em] text-ink-soft">
                  {u.email}
                </span>
                <div className="ml-auto flex gap-2">
                  <ClientActionButton userId={u.id} action="REACTIVATE" label="重新啟用" variant="ghost" />
                  <ClientActionButton
                    userId={u.id}
                    action="ARCHIVE"
                    label="封存"
                    variant="danger"
                    confirmText="確定封存？"
                  />
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 已歸檔 */}
      {archived.length > 0 && (
        <Section title={`已歸檔 (${archived.length})`}>
          <ul className="space-y-2 opacity-50">
            {archived.map((u) => (
              <li key={u.id} className="text-sm">
                {u.name ?? "（無名）"} · {u.email}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark mb-5">
        {title}
      </p>
      {children}
    </section>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
      {children}
    </p>
  );
}

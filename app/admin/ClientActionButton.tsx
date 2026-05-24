"use client";

// Admin 端：對某個 user 觸發狀態變更。
// 按下 → PATCH 到 API → 重新整理頁面。

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Action = "APPROVE" | "REJECT" | "PAUSE" | "ARCHIVE" | "REACTIVATE";

type Props = {
  userId: string;
  action: Action;
  label: string;
  confirmText?: string;
  variant?: "primary" | "ghost" | "danger";
};

export function ClientActionButton({
  userId,
  action,
  label,
  confirmText,
  variant = "ghost",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (confirmText && !confirm(confirmText)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    }
  };

  const base =
    "inline-block font-sans text-xs tracking-[0.2em] uppercase px-3 py-1.5 transition-colors disabled:opacity-40";
  const styles = {
    primary:
      "bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark hover:opacity-85",
    ghost:
      "border border-rule text-ink-muted hover:text-ink hover:border-ink/30",
    danger: "text-ink-muted hover:text-ink underline underline-offset-4",
  } as const;

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={`${base} ${styles[variant]}`}
      >
        {pending ? "⋯" : label}
      </button>
      {error && (
        <span className="ml-2 font-sans text-xs text-ink-muted">{error}</span>
      )}
    </>
  );
}

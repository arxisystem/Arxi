"use client";

// 設定頁的客戶端表單。
// 切換 checkbox → 立即 PATCH 到 /api/me/settings；不需要按儲存。

import { useState } from "react";

type Props = {
  initialAdmin: boolean;
  initialCommunity: boolean;
};

export function SettingsForm({ initialAdmin, initialCommunity }: Props) {
  const [admin, setAdmin] = useState(initialAdmin);
  const [community, setCommunity] = useState(initialCommunity);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (next: { admin?: boolean; community?: boolean }) => {
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, boolean> = {};
      if (next.admin !== undefined) body.defaultShareWithAdmin = next.admin;
      if (next.community !== undefined) body.defaultShareWithCommunity = next.community;

      const res = await fetch("/api/me/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "save failed");
      // 撤回 optimistic 更新
      if (next.admin !== undefined) setAdmin((v) => !v);
      if (next.community !== undefined) setCommunity((v) => !v);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={admin}
          disabled={saving}
          onChange={(e) => {
            setAdmin(e.target.checked);
            update({ admin: e.target.checked });
          }}
          className="mt-1.5 accent-ink dark:accent-ink-dark"
        />
        <div>
          <p className="text-base">寫新 entry 時，預設勾「分享給太曦」</p>
          <p className="mt-1 font-sans text-xs tracking-[0.1em] text-ink-soft dark:text-ink-muted-dark">
            勾了之後，寫新紀錄時這個選項會預設打勾——仍可逐次取消。
          </p>
        </div>
      </label>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={community}
          disabled={saving}
          onChange={(e) => {
            setCommunity(e.target.checked);
            update({ community: e.target.checked });
          }}
          className="mt-1.5 accent-ink dark:accent-ink-dark"
        />
        <div>
          <p className="text-base">寫新 entry 時，預設勾「讓其他個案匿名看到」</p>
          <p className="mt-1 font-sans text-xs tracking-[0.1em] text-ink-soft dark:text-ink-muted-dark">
            勾了之後，新紀錄會預設匿名出現在「今日的分享」。
          </p>
        </div>
      </label>

      {error && (
        <p className="font-sans text-xs text-ink-muted dark:text-ink-muted-dark">
          儲存失敗：{error}
        </p>
      )}
    </div>
  );
}

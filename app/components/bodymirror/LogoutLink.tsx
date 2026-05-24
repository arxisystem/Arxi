"use client";

// 登出。signOut → 把 NextAuth cookie 清掉、redirect 回 /login。

import { signOut } from "next-auth/react";

export function LogoutLink({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={
        className ||
        "font-sans text-xs tracking-[0.25em] uppercase text-ink-soft dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors"
      }
    >
      登出
    </button>
  );
}

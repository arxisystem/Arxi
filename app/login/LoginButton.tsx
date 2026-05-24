"use client";

// Google 登入按鈕。spec §9.1。
// 視覺：ink bg / paper text / tracking-[0.3em] uppercase。

import { signIn } from "next-auth/react";

export function LoginButton() {
  const onClick = () => {
    // OAuth 完成後，把 NextAuth 送回 /login——proxy 看到「已登入 + /login」就會依 role 分流：
    //   ADMIN → /admin
    //   ACTIVE client → /practice
    //   PENDING client → /practice/pending
    // 不要硬寫成 /practice，否則 ADMIN 會卡在 /practice、進不去 /admin。
    signIn("google", { callbackUrl: "/login" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark px-10 py-4 hover:opacity-85 transition-opacity"
    >
      <GoogleMark />
      使用 Google 繼續
    </button>
  );
}

function GoogleMark() {
  // 簡化的 Google G。深色按鈕底上用單色版（paper 色），維持極簡。
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      aria-hidden
      className="opacity-90"
    >
      <path
        fill="currentColor"
        d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.84H9v3.49h4.84a4.13 4.13 0 0 1-1.79 2.72v2.26h2.9a8.74 8.74 0 0 0 2.69-6.63z"
      />
      <path
        fill="currentColor"
        d="M9 18a8.6 8.6 0 0 0 5.95-2.18l-2.9-2.26a5.41 5.41 0 0 1-8.06-2.84H.96v2.33A9 9 0 0 0 9 18z"
        opacity=".75"
      />
      <path
        fill="currentColor"
        d="M3.99 10.72A5.41 5.41 0 0 1 3.71 9c0-.6.1-1.18.28-1.72V4.95H.96a9 9 0 0 0 0 8.1l3.03-2.33z"
        opacity=".55"
      />
      <path
        fill="currentColor"
        d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.59A8.66 8.66 0 0 0 9 0 9 9 0 0 0 .96 4.95l3.03 2.33A5.41 5.41 0 0 1 9 3.58z"
        opacity=".35"
      />
    </svg>
  );
}

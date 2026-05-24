// Body Mirror 登入頁。spec §9.1。
// 視覺已完成；按鈕功能在 phase 2 接通 NextAuth 後啟用。
// 極簡 hero、無其他內容；對齊 spec：「極簡 hero、無其他內容」。

import { LoginButton } from "./LoginButton";

export const metadata = {
  title: "太曦｜Body Mirror",
  description: "開始看見自己的身體。",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.18em] leading-snug">
          太曦
          <span className="mx-2 text-ink-soft">｜</span>
          Body Mirror
        </h1>

        <p className="mt-6 font-sans text-sm tracking-[0.25em] text-ink-muted dark:text-ink-muted-dark">
          開始看見自己的身體
        </p>

        <div
          className="mx-auto mt-12 w-32 h-px bg-gradient-to-r from-transparent via-ink-soft to-transparent"
          aria-hidden
        />

        <div className="mt-16">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}

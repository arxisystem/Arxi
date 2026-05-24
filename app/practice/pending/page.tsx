// 等待開通頁。spec §9.2。
// 鐵則：不顯示「等待中 X 天」「您是第 N 位」。純文字、無 CTA 壓力。

import { auth } from "@/auth";
import { LogoutLink } from "@/app/components/bodymirror/LogoutLink";

export default async function PendingPage() {
  const session = await auth();
  const name = session?.user?.name ?? "你";

  return (
    <article className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-soft dark:text-ink-muted-dark">
          太曦｜Body Mirror
        </p>

        <h1 className="mt-10 font-serif text-2xl sm:text-3xl tracking-[0.08em] leading-relaxed">
          你好，{name}。
        </h1>

        <div
          className="mt-8 w-16 h-px bg-gradient-to-r from-ink-soft to-transparent dark:from-ink-muted-dark"
          aria-hidden
        />

        <p className="mt-10 text-lg leading-loose text-ink dark:text-ink-dark">
          太曦會在開通後通知你。
        </p>
        <p className="mt-4 text-base leading-loose text-ink-muted dark:text-ink-muted-dark">
          通常是在你完成初次體驗或六次陪伴計畫之後。
        </p>

        <p className="mt-12 text-sm leading-loose text-ink-muted dark:text-ink-muted-dark">
          如果有疑問，
          <br />
          可以寫信給{" "}
          <a
            href="mailto:arxi.system@gmail.com"
            className="underline underline-offset-4 hover:text-ink dark:hover:text-ink-dark"
          >
            arxi.system@gmail.com
          </a>
          。
        </p>

        <div className="mt-16">
          <LogoutLink />
        </div>
      </div>
    </article>
  );
}

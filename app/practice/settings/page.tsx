// 設定頁。目前包含：個人資料（讀 Google）+ 分享預設偏好。
// 之後可加：通知偏好、刪除帳號、匯出資料等。

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      defaultShareWithAdmin: true,
      defaultShareWithCommunity: true,
      createdAt: true,
    },
  });
  if (!me) return null;

  return (
    <article className="px-6 py-12 pb-24">
      <header>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark">
          設定
        </p>
        <h1 className="mt-6 font-serif text-2xl tracking-[0.1em] leading-relaxed">
          你的偏好
        </h1>
      </header>

      {/* 個人資料 */}
      <section className="mt-12">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark mb-5">
          個人資料
        </p>
        <dl className="space-y-3 text-base">
          <div className="flex">
            <dt className="w-24 text-ink-muted dark:text-ink-muted-dark">名稱</dt>
            <dd>{me.name ?? "—"}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-ink-muted dark:text-ink-muted-dark">Email</dt>
            <dd>{me.email}</dd>
          </div>
          <div className="flex">
            <dt className="w-24 text-ink-muted dark:text-ink-muted-dark">加入時間</dt>
            <dd>
              {me.createdAt.getFullYear()}.{String(me.createdAt.getMonth() + 1).padStart(2, "0")}
              .{String(me.createdAt.getDate()).padStart(2, "0")}
            </dd>
          </div>
        </dl>
        <p className="mt-3 font-sans text-xs tracking-[0.1em] text-ink-soft dark:text-ink-muted-dark">
          資料來自你的 Google 帳號，無法在這裡編輯。
        </p>
      </section>

      {/* 分享預設 */}
      <section className="mt-12">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark mb-5">
          分享預設
        </p>
        <SettingsForm
          initialAdmin={me.defaultShareWithAdmin}
          initialCommunity={me.defaultShareWithCommunity}
        />
      </section>
    </article>
  );
}

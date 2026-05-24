// /admin/* 共用 layout。Body Mirror admin 入口。
// TODO: phase 2 — middleware 已會擋住非 ADMIN。
// 之後可加 admin header（含登出、客戶清單回連）。

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark">
      {/* TODO: phase 4 — admin header */}
      <main className="mx-auto max-w-4xl">{children}</main>
    </div>
  );
}

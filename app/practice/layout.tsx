// /practice/* 共用 layout：側邊欄 + 主內容區。
// 桌面：固定左側欄；手機：抽屜式。
// Body Mirror 全程不顯示主站 Nav/Footer（由根 layout 依 x-pathname 條件渲染）。

import { Sidebar } from "@/app/components/bodymirror/Sidebar";

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper dark:bg-paper-dark text-ink dark:text-ink-dark md:flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    </div>
  );
}

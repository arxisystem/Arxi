// 看 / 編輯特定 entry。spec §7。
// TODO: phase 3 — 從 entry id 抓回；只能看 / 編自己的 entry（API 端再驗證一次）。

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EntryDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="px-6 py-12">
      <p className="text-ink-muted">
        {/* TODO: phase 3 — entry {id} 內容 */}
        Body Mirror — Entry {id}（待實作）
      </p>
    </div>
  );
}

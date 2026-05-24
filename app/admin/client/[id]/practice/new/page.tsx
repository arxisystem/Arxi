// Admin 指派新練習。spec §10.3。
// TODO: phase 4 — 類型選擇（BREATH/OBSERVATION/MOVEMENT/STILLNESS/STRETCH）；
// 標題 + 說明（textarea）+ 預估時間（3/5/10 分）。

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewPracticePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="px-6 py-12">
      <p className="text-ink-muted">
        {/* TODO: phase 4 — 為客戶 {id} 指派新練習 */}
        Body Mirror Admin — 新增今日練習（待實作）
      </p>
    </div>
  );
}

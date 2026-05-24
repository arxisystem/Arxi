// Admin: 列出所有 users（含 status / lastEntryAt）。spec §10.1。
// GET：限 ADMIN role。
// TODO: phase 4 — 實作；做 status 分組與 last entry date 計算。

export async function GET() {
  return Response.json({ error: "TODO: phase 4 implement" }, { status: 501 });
}

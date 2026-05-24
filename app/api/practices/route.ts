// Practices API。spec §7。
// GET：列出 caller 的當日 practice（admin 視 query 可指定 userId）。
// POST：admin 指派新練習給某 client。
// TODO: phase 3-4 — 實作；POST 限 ADMIN role。

export async function GET() {
  return Response.json({ error: "TODO: phase 3 implement" }, { status: 501 });
}

export async function POST() {
  return Response.json({ error: "TODO: phase 4 implement" }, { status: 501 });
}

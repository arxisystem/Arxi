// 單一 Entry CRUD。spec §7。
// GET / PATCH / DELETE — caller 必須是 entry 擁有者，或 ADMIN（且 entry.shareWithAdmin=true 才能讀內容）。
// TODO: phase 3 — 實作。

export async function GET() {
  return Response.json({ error: "TODO: phase 3 implement" }, { status: 501 });
}

export async function PATCH() {
  return Response.json({ error: "TODO: phase 3 implement" }, { status: 501 });
}

export async function DELETE() {
  return Response.json({ error: "TODO: phase 3 implement" }, { status: 501 });
}

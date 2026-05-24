// Entries API。spec §7。
// GET：列出 caller 自己的 entries（依 entryDate 由新到舊）。
// POST：建立新 entry——caller 必須是 ACTIVE client 或 ADMIN。
//
// 鐵則：滑桿值 1-10 整數，client 端不顯示數字（前端負責）；
//      shareWithAdmin / shareWithCommunity 預設都是 false，必須使用者主動勾。

import { auth } from "@/auth";
import { db } from "@/lib/db";

type PostBody = {
  entryDate?: string; // YYYY-MM-DD（瀏覽器本地時區）
  breathValue?: number | null;
  bodyValue?: number | null;
  presenceValue?: number | null;
  notesShape?: string | null;
  notesMoment?: string | null;
  tagNames?: string[]; // tag.name 陣列
  shareWithAdmin?: boolean;
  shareWithCommunity?: boolean;
};

function clamp1to10(v: unknown): number | null {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.max(1, Math.min(10, Math.round(n)));
}

function parseDate(s: unknown): Date {
  if (typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // 把 YYYY-MM-DD 當當地日期、午夜 UTC——@db.Date 只看日期、tz 不影響
    return new Date(`${s}T00:00:00.000Z`);
  }
  return new Date();
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const entries = await db.entry.findMany({
    where: { userId: session.user.id },
    orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
    include: { entryTags: { include: { tag: true } } },
  });
  return Response.json({ entries });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  // ADMIN 也允許寫（測試用）；非 ACTIVE/ADMIN 擋掉
  if (session.user.role !== "ADMIN" && session.user.status !== "ACTIVE") {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  let body: PostBody;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  // tag 對應 — 從 tag.name 查到 tag.id
  const tagNames = Array.isArray(body.tagNames) ? body.tagNames : [];
  const tags = tagNames.length
    ? await db.tag.findMany({
        where: { name: { in: tagNames }, active: true },
        select: { id: true },
      })
    : [];

  const entry = await db.entry.create({
    data: {
      userId: session.user.id,
      entryDate: parseDate(body.entryDate),
      breathValue: clamp1to10(body.breathValue),
      bodyValue: clamp1to10(body.bodyValue),
      presenceValue: clamp1to10(body.presenceValue),
      notesShape: (body.notesShape ?? "").trim() || null,
      notesMoment: (body.notesMoment ?? "").trim() || null,
      shareWithAdmin: !!body.shareWithAdmin,
      shareWithCommunity: !!body.shareWithCommunity,
      entryTags: {
        create: tags.map((t) => ({ tagId: t.id })),
      },
    },
    select: { id: true, entryDate: true },
  });

  return Response.json({ ok: true, entry }, { status: 201 });
}

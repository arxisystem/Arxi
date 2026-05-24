// Admin 動作：approve / reject / pause / archive 某 user。
// body.action: "APPROVE" | "REJECT" | "PAUSE" | "ARCHIVE" | "REACTIVATE"
// 對應狀態：
//   APPROVE     → ACTIVE
//   REJECT      → ARCHIVED （拒絕開通）
//   PAUSE       → PAUSED  （暫停活躍客）
//   ARCHIVE     → ARCHIVED
//   REACTIVATE  → ACTIVE  （從 PAUSED 重新啟用）
//
// 限 ADMIN role；ADMIN 自己不能改自己的 status（避免誤鎖死）。

import { auth } from "@/auth";
import { db } from "@/lib/db";

type Body = { action?: string };

const ACTION_TO_STATUS: Record<string, "ACTIVE" | "PAUSED" | "ARCHIVED"> = {
  APPROVE: "ACTIVE",
  REJECT: "ARCHIVED",
  PAUSE: "PAUSED",
  ARCHIVE: "ARCHIVED",
  REACTIVATE: "ACTIVE",
};

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.user.id) {
    return Response.json(
      { error: "cannot modify your own status" },
      { status: 400 },
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const newStatus = body.action ? ACTION_TO_STATUS[body.action] : undefined;
  if (!newStatus) {
    return Response.json(
      {
        error: "action required (APPROVE | REJECT | PAUSE | ARCHIVE | REACTIVATE)",
      },
      { status: 400 },
    );
  }

  const updated = await db.user.update({
    where: { id },
    data: { status: newStatus },
    select: { id: true, email: true, status: true, role: true },
  });

  return Response.json({ ok: true, user: updated });
}

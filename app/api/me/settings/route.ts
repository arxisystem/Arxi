// 個人設定 API：目前只開放編輯 defaultShareWithAdmin / defaultShareWithCommunity。

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: {
    defaultShareWithAdmin?: boolean;
    defaultShareWithCommunity?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const data: {
    defaultShareWithAdmin?: boolean;
    defaultShareWithCommunity?: boolean;
  } = {};
  if (typeof body.defaultShareWithAdmin === "boolean") {
    data.defaultShareWithAdmin = body.defaultShareWithAdmin;
  }
  if (typeof body.defaultShareWithCommunity === "boolean") {
    data.defaultShareWithCommunity = body.defaultShareWithCommunity;
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data,
    select: {
      defaultShareWithAdmin: true,
      defaultShareWithCommunity: true,
    },
  });

  return Response.json({ ok: true, user: updated });
}

// Debug 端點：回傳目前 session 內容（你 cookie 裡的 JWT 解出來是什麼）。
// 線上 production 不暴露這個——所以擋掉 NODE_ENV=production。
// TODO: phase 5 部署前刪掉或加 ADMIN guard。

import { auth } from "@/auth";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response("not available in production", { status: 404 });
  }
  const session = await auth();
  return Response.json({
    hasSession: !!session,
    user: session?.user ?? null,
  });
}

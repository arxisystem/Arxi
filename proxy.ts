// Body Mirror route guard。spec §6。
// Next 16：以前是 middleware.ts、新版改名 proxy.ts；export 形式不變（default function）。
//
// 規則：
//   /practice/*  → 需 login，且 status=ACTIVE 才能進。PENDING 導去 /practice/pending；未登入導去 /login。
//   /admin/*     → 需 login，且 role=ADMIN。其他導去 /login（或回 /practice）。
//
// 額外：把 pathname 寫進 request header，讓根 layout 可以條件渲染 Nav/Footer
//      （Body Mirror 頁面不應顯示主站 Nav/Footer）。
//
// 重要：import 自 auth.config（edge-safe，無 PrismaAdapter）、不是 auth.ts。
//      讓 proxy 永遠跑得動。session 走 JWT 策略、cookie 解出來就有 role/status。

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 把 pathname 帶進 request header，讓根 layout 可以條件渲染 Nav/Footer。
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const session = req.auth;
  const role = session?.user?.role;
  const status = session?.user?.status;

  // /admin/* — 需登入 + ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (role !== "ADMIN") {
      // 非 admin 進 /admin → 導去 /practice（若 ACTIVE）或 /practice/pending
      const fallback = status === "ACTIVE" ? "/practice" : "/practice/pending";
      return NextResponse.redirect(new URL(fallback, req.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // /practice/* — 需登入
  if (pathname.startsWith("/practice")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // ADMIN 也可進 /practice（看自己 entry）；status 不為 ACTIVE 的 client 導去 pending
    if (role !== "ADMIN" && status !== "ACTIVE" && pathname !== "/practice/pending") {
      return NextResponse.redirect(new URL("/practice/pending", req.url));
    }
    // 已 ACTIVE 卻在 /practice/pending → 導回 /practice
    if (status === "ACTIVE" && pathname === "/practice/pending") {
      return NextResponse.redirect(new URL("/practice", req.url));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // /login — 已登入就直接導去對應頁
  if (pathname === "/login" && session) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (status === "ACTIVE") return NextResponse.redirect(new URL("/practice", req.url));
    return NextResponse.redirect(new URL("/practice/pending", req.url));
  }

  // 其他路徑（arxi.tw 主站）— 仍把 pathname header 帶過去
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  // 排除靜態資源 + Next 內部路徑 + 圖片等，避免每個 asset 都跑 middleware
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|paper-texture.svg|images|robots.txt|sitemap.xml).*)",
  ],
};

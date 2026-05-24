// NextAuth v5 (Auth.js) — full 設定（含 PrismaAdapter）。
// 給 route handler / API / server components 用。
// proxy.ts 不要 import 這個檔（會把 Prisma 拖進 edge bundle）；那邊改 import auth.config.ts。
//
// Session 策略：JWT。Edge-safe middleware 不能查 DB；JWT 在 cookie 裡、middleware 解 token 即可。
// 代價：admin 改某 user 的 role/status 後，那個 user 要登出再登入才會生效。v1 可接受。

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    // 保留 auth.config 的 session 投影（edge-safe），加上自己的 jwt（會碰 DB）。
    ...authConfig.callbacks,
    /**
     * 登入當下會跑（user 物件存在）。
     * NextAuth v5 的 PrismaAdapter 傳進來的 user 只有標準欄位（id/name/email/image），
     * **不含** 自訂欄位（role/status）——所以這裡直接從 DB 查、塞進 token。
     * 之後每次 token 重整（user 為 undefined）就走快取、不再查 DB。
     */
    async jwt({ token, user, trigger }) {
      // 首次登入：user 為 AdapterUser；後續刷新 user 為 undefined。
      if (user) {
        const u = user as { id?: string; email?: string | null };

        // 多重後備：先用 id 查、查不到再用 email；都失敗就維持 token 原樣（fallback CLIENT/PENDING）
        let dbUser: { id: string; role: "CLIENT" | "ADMIN"; status: "PENDING" | "ACTIVE" | "PAUSED" | "ARCHIVED" } | null = null;
        if (u.id) {
          dbUser = await db.user.findUnique({
            where: { id: u.id },
            select: { id: true, role: true, status: true },
          });
        }
        if (!dbUser && u.email) {
          dbUser = await db.user.findUnique({
            where: { email: u.email },
            select: { id: true, role: true, status: true },
          });
        }
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
        }

        // dev debug — 確認 callback 真的有跑過：
        // 看 dev terminal 應看到「[jwt] hydrated token: ...」
        if (process.env.NODE_ENV !== "production") {
          console.log("[jwt] hydrated token for sign-in", {
            id: token.id,
            email: u.email,
            role: token.role,
            status: token.status,
          });
        }
      }

      // 客戶端可呼叫 update() 強迫拉最新 role/status（例如 admin 剛 approve）
      if (trigger === "update" && token.sub) {
        const fresh = await db.user.findUnique({
          where: { id: token.sub as string },
          select: { role: true, status: true },
        });
        if (fresh) {
          token.role = fresh.role;
          token.status = fresh.status;
        }
      }

      return token;
    },
  },
});

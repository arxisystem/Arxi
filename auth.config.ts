// NextAuth v5 — edge-safe 配置。
// 不 import PrismaAdapter / db、proxy 可以安全在 Edge runtime 跑。
// auth.ts 會把這個 config 合進來、再加上 adapter 與 DB-aware jwt callback。

import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * Edge-safe session 投影：把 token 內的欄位映射到 session.user。
     * Token 的 role/status 在 auth.ts 的 jwt callback 從 DB 拉好後就會帶在 token 裡。
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? (token.sub as string);
        session.user.role =
          (token.role as "CLIENT" | "ADMIN") ?? "CLIENT";
        session.user.status =
          (token.status as "PENDING" | "ACTIVE" | "PAUSED" | "ARCHIVED") ??
          "PENDING";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

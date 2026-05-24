// 擴充 next-auth 的 Session 型別，把 role / status 加進 session.user。
// 看 auth.ts callbacks.session。

import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "CLIENT" | "ADMIN";
      status: "PENDING" | "ACTIVE" | "PAUSED" | "ARCHIVED";
    };
  }
}

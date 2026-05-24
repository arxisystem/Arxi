// NextAuth v5 (Auth.js) catch-all route handler。
// 所有 OAuth 流程（/api/auth/signin, /api/auth/callback/google, /api/auth/signout 等）
// 都會被導到這支 handler。
// auth.ts 在 repo root；@/auth alias 由 tsconfig paths 解析。

import { handlers } from "@/auth";

export const { GET, POST } = handlers;

// Body Mirror — 共用 Prisma client 單例。
// Next.js dev hot-reload 每次重新 import 模組會建一個新 PrismaClient，
// 把 DB 連線打爆——用 globalThis 快取避免。

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

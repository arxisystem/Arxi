// 把指定 email 的 User 升級為 ADMIN + ACTIVE。
// 跑法：`npm run promote:admin`（預設 arxi.system@gmail.com）
//      或 `npm run promote:admin -- other@example.com`
//
// 注意：該使用者必須**先做過一次 Google OAuth 登入**、DB 裡才有 row。
// 找不到 row 時腳本會明確報錯，請先去 /login 完成一次登入再跑。

import { PrismaClient } from "@prisma/client";

const DEFAULT_EMAIL = "arxi.system@gmail.com";
const email = process.argv[2] || DEFAULT_EMAIL;

const prisma = new PrismaClient();

try {
  const before = await prisma.user.findUnique({ where: { email } });
  if (!before) {
    console.error(
      `\n❌ DB 找不到 email=${email}\n` +
        `   請先在瀏覽器用這個 email 走一次 Google 登入（http://localhost:3001/login），` +
        `\n   讓 NextAuth 建好 User row，再回來跑這個腳本。\n`,
    );
    process.exit(1);
  }

  const updated = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN", status: "ACTIVE" },
  });

  console.log(`\n✅ 已升級：`);
  console.log(`   email  ${updated.email}`);
  console.log(`   name   ${updated.name ?? "(尚未設定)"}`);
  console.log(`   role   ${before.role} → ${updated.role}`);
  console.log(`   status ${before.status} → ${updated.status}`);
  console.log(`\n登出再登入一次後，會被導去 /admin。\n`);
} catch (e) {
  console.error("升級失敗：", e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}

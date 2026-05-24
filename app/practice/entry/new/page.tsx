// 寫今日 entry — server entry，抓使用者分享偏好預設值後傳給 client form。

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { EntryForm } from "./EntryForm";

export default async function EntryNewPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      defaultShareWithAdmin: true,
      defaultShareWithCommunity: true,
    },
  });

  return (
    <EntryForm
      initialShareWithAdmin={me?.defaultShareWithAdmin ?? false}
      initialShareWithCommunity={me?.defaultShareWithCommunity ?? false}
    />
  );
}

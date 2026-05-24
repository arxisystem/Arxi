// Body Mirror — 初始 tag seed（17 個），照 spec §5。
// 跑法：`npx prisma db seed`（package.json 已配 prisma.seed）。

import { PrismaClient, TagCategory } from "@prisma/client";

const prisma = new PrismaClient();

type SeedTag = { name: string; category: TagCategory; order: number };

const tags: SeedTag[] = [
  // BODY_LOCATION
  { name: "肩頸", category: TagCategory.BODY_LOCATION, order: 1 },
  { name: "胸口", category: TagCategory.BODY_LOCATION, order: 2 },
  { name: "頭", category: TagCategory.BODY_LOCATION, order: 3 },
  { name: "腰", category: TagCategory.BODY_LOCATION, order: 4 },
  { name: "胃", category: TagCategory.BODY_LOCATION, order: 5 },
  { name: "背", category: TagCategory.BODY_LOCATION, order: 6 },

  // BREATH_QUALITY
  { name: "卡住", category: TagCategory.BREATH_QUALITY, order: 1 },
  { name: "很淺", category: TagCategory.BREATH_QUALITY, order: 2 },
  { name: "很急", category: TagCategory.BREATH_QUALITY, order: 3 },
  { name: "很沉", category: TagCategory.BREATH_QUALITY, order: 4 },
  { name: "比較穩", category: TagCategory.BREATH_QUALITY, order: 5 },
  { name: "說不上來", category: TagCategory.BREATH_QUALITY, order: 6 },

  // STATE
  { name: "撐著", category: TagCategory.STATE, order: 1 },
  { name: "鬆開", category: TagCategory.STATE, order: 2 },
  { name: "焦躁", category: TagCategory.STATE, order: 3 },
  { name: "沉重", category: TagCategory.STATE, order: 4 },
  { name: "流動", category: TagCategory.STATE, order: 5 },
];

async function main() {
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: { category: tag.category, order: tag.order, active: true },
      create: tag,
    });
  }
  console.log(`Seeded ${tags.length} tags.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

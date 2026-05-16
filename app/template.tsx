"use client";

import { motion } from "framer-motion";

/**
 * 換頁轉場：每次導覽切換時，頁面內容淡入並輕微上滑。
 *
 * template.tsx 每次導覽都會 remount（Next 給它唯一 key），
 * 所以這個進場動畫每次換頁都會重新觸發。
 * 它在 layout 之內、page 之外——Nav / Footer 不動，只有內容區做動畫。
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
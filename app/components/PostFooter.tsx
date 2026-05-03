import Link from "next/link";
import { TrackedLink } from "./TrackedLink";

const LINE_CHAT_URL = "https://lin.ee/vGZ9R8E";

type PostFooterProps = {
  /** 此文章所在的 section，影響「全部 ⋯」回連 */
  section: "writing" | "teaching";
};

const SECTION_LABEL: Record<PostFooterProps["section"], string> = {
  writing: "全部文章",
  teaching: "全部教學",
};

/**
 * 文章 / 教學文章底部統一 footer。
 *
 * 主動作：「這篇有觸動你？來聊聊 →」LINE 聊天入口。
 * 次動作：訂閱、回列表。
 */
export function PostFooter({ section }: PostFooterProps) {
  return (
    <footer className="mt-24">
      {/* 主 CTA：LINE 聊聊 */}
      <div className="pt-12 border-t border-rule text-center">
        <TrackedLink
          href={LINE_CHAT_URL}
          event="line_chat_click"
          className="inline-block font-sans text-sm tracking-[0.25em] bg-ink text-paper px-10 py-4 hover:opacity-85 transition-opacity"
        >
          這篇有觸動你？來聊聊 →
        </TrackedLink>
      </div>

      {/* 次連結 */}
      <div className="mt-12 pt-8 border-t border-rule flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
        <Link
          href="/subscribe"
          className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors"
        >
          訂閱：當有東西值得說的時候 →
        </Link>
        <Link
          href={`/${section}`}
          className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted hover:text-ink transition-colors"
        >
          ← {SECTION_LABEL[section]}
        </Link>
      </div>
    </footer>
  );
}

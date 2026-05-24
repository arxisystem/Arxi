// 過去紀錄裡的單一 entry 顯示——三條滑桿位置 + tag 清單 + 開放文字（可選）。
// 鐵則 1：純位置 + 純 tag、不顯示數字、不畫趨勢線。

import { SliderReadout } from "./SliderReadout";

type Entry = {
  id: string;
  entryDate: Date;
  breathValue: number | null;
  bodyValue: number | null;
  presenceValue: number | null;
  notesShape: string | null;
  notesMoment: string | null;
  entryTags: { tag: { name: string } }[];
};

function formatDate(d: Date, todayMs: number): string {
  // 以瀏覽器當地時區呈現「今天 / 昨天 / M/D 週X」
  const local = new Date(d);
  const diffDays = Math.round(
    (todayMs - new Date(local.getFullYear(), local.getMonth(), local.getDate()).getTime()) /
      (24 * 3600 * 1000),
  );
  if (diffDays === 0) return "今天";
  if (diffDays === 1) return "昨天";
  const weeks = ["日", "一", "二", "三", "四", "五", "六"];
  return `${local.getMonth() + 1}/${local.getDate()} 週${weeks[local.getDay()]}`;
}

export function EntryRow({ entry, todayMs }: { entry: Entry; todayMs: number }) {
  const label = formatDate(entry.entryDate, todayMs);
  const tagNames = entry.entryTags.map((et) => et.tag.name);
  const notes = entry.notesShape || entry.notesMoment;

  return (
    <article className="py-5 first:pt-0 border-b border-rule/40 dark:border-rule-dark/40 last:border-b-0">
      <p className="font-sans text-xs tracking-[0.25em] text-ink-muted dark:text-ink-muted-dark mb-3">
        {label}
      </p>
      <div className="space-y-2">
        <SliderReadout
          dimLabel="呼吸"
          value={entry.breathValue}
          leftLabel="卡住"
          rightLabel="流動"
        />
        <SliderReadout
          dimLabel="身體"
          value={entry.bodyValue}
          leftLabel="撐著"
          rightLabel="鬆開"
        />
        <SliderReadout
          dimLabel="存在"
          value={entry.presenceValue}
          leftLabel="沉"
          rightLabel="輕"
        />
      </div>
      {tagNames.length > 0 && (
        <p className="mt-3 font-sans text-xs tracking-[0.15em] text-ink-muted dark:text-ink-muted-dark">
          {tagNames.join(" · ")}
        </p>
      )}
      {notes && (
        <p className="mt-3 text-sm leading-relaxed text-ink/85 dark:text-ink-dark/85 whitespace-pre-line">
          {notes}
        </p>
      )}
    </article>
  );
}

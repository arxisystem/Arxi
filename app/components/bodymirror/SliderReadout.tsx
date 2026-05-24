// 唯讀的滑桿位置顯示——線 + 點 + 數字。
// 維度標 + 數字 + 線 + 兩端標。用於 history / dashboard 過去紀錄。

type Props = {
  value: number | null; // 1-10
  leftLabel: string;
  rightLabel: string;
  dimLabel: string;
};

export function SliderReadout({ value, leftLabel, rightLabel, dimLabel }: Props) {
  const hasValue = typeof value === "number" && value >= 1 && value <= 10;
  const pct = hasValue ? ((value - 1) / 9) * 100 : 0;

  return (
    <div className="grid grid-cols-[3.5em_1.5em_2.5em_1fr_2.5em] items-center gap-2 text-xs">
      <span className="font-sans tracking-[0.2em] text-ink-muted dark:text-ink-muted-dark">
        {dimLabel}
      </span>
      <span className="font-serif text-sm text-ink dark:text-ink-dark text-right tabular-nums">
        {hasValue ? value : "—"}
      </span>
      <span className="font-sans tracking-[0.15em] text-ink-soft dark:text-ink-muted-dark text-right">
        {leftLabel}
      </span>
      <div className="relative h-px bg-rule dark:bg-rule-dark">
        {hasValue && (
          <div
            className="absolute top-1/2 w-1.5 h-1.5 bg-ink dark:bg-ink-dark rounded-full"
            style={{
              left: `${pct}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
      <span className="font-sans tracking-[0.15em] text-ink-soft dark:text-ink-muted-dark">
        {rightLabel}
      </span>
    </div>
  );
}

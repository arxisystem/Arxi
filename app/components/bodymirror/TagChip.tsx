"use client";

// Body Mirror tag chip。spec §8。
// 未選：transparent bg / ink-muted text；已選：paper-darker bg / ink text。
// 不用勾勾 icon、不用 spinner、只用顏色 + 細邊。

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export function TagChip({ label, selected, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={
        "px-3.5 py-1.5 border text-sm tracking-[0.05em] transition-colors " +
        (selected
          ? "bg-ink/5 dark:bg-ink-dark/10 border-ink/40 dark:border-ink-dark/40 text-ink dark:text-ink-dark"
          : "bg-transparent border-ink/15 dark:border-ink-dark/15 text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:border-ink/30")
      }
    >
      {label}
    </button>
  );
}

"use client";

// Body Mirror 滑桿。spec §8。
// 鐵則：不顯示數字 / 刻度 / 「平均」「進步」標籤。
// 兩端 state label（如「卡住」「流動」）放外部、不在 component 內。
// 拇指有輕微縮放回饋；active 段比軌道深一點（不要鮮豔色）。

import * as RadixSlider from "@radix-ui/react-slider";

type Props = {
  value: number; // 1-10
  onChange: (v: number) => void;
  ariaLabel: string;
};

export function Slider({ value, onChange, ariaLabel }: Props) {
  return (
    <RadixSlider.Root
      value={[value]}
      min={1}
      max={10}
      step={1}
      onValueChange={([v]) => onChange(v)}
      aria-label={ariaLabel}
      className="relative flex items-center select-none touch-none w-full h-8"
    >
      <RadixSlider.Track className="relative grow h-px bg-rule dark:bg-rule-dark">
        <RadixSlider.Range className="absolute h-px bg-ink-muted dark:bg-ink-muted-dark" />
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="block w-3.5 h-3.5 bg-ink dark:bg-ink-dark rounded-full shadow-sm hover:scale-110 focus:scale-110 active:scale-125 transition-transform focus:outline-none"
      />
    </RadixSlider.Root>
  );
}

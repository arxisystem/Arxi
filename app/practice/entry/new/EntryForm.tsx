"use client";

// 寫今日 entry — client form。
// 初始 share defaults 從 server props 來（讀 User.defaultShareWith*）。

import { useState } from "react";
import { Slider } from "@/app/components/bodymirror/Slider";
import { TagChip } from "@/app/components/bodymirror/TagChip";

// hardcoded 17 預設 tag——對應 prisma/seed.ts；之後改 server fetch
const BREATH_TAGS = ["卡住", "很淺", "很急", "很沉", "比較穩", "說不上來"];
const BODY_TAGS = ["肩頸", "胸口", "頭", "腰", "胃", "背"];
const STATE_TAGS = ["撐著", "鬆開", "焦躁", "沉重", "流動"];

function todayLocalIso(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

type Props = {
  initialShareWithAdmin: boolean;
  initialShareWithCommunity: boolean;
};

export function EntryForm({ initialShareWithAdmin, initialShareWithCommunity }: Props) {
  const todayIso = todayLocalIso();
  const [entryDate, setEntryDate] = useState(todayIso);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [breathValue, setBreathValue] = useState(5);
  const [bodyValue, setBodyValue] = useState(5);
  const [presenceValue, setPresenceValue] = useState(5);

  const [breathTags, setBreathTags] = useState<Set<string>>(new Set());
  const [bodyTags, setBodyTags] = useState<Set<string>>(new Set());
  const [stateTags, setStateTags] = useState<Set<string>>(new Set());

  const [notesShape, setNotesShape] = useState("");
  const [notesMoment, setNotesMoment] = useState("");
  const [shareWithAdmin, setShareWithAdmin] = useState(initialShareWithAdmin);
  const [shareWithCommunity, setShareWithCommunity] = useState(initialShareWithCommunity);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggle = (s: Set<string>, name: string, setter: (s: Set<string>) => void) => {
    const next = new Set(s);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setter(next);
  };

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const tagNames = [
        ...Array.from(breathTags),
        ...Array.from(bodyTags),
        ...Array.from(stateTags),
      ];
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entryDate,
          breathValue,
          bodyValue,
          presenceValue,
          notesShape,
          notesMoment,
          tagNames,
          shareWithAdmin,
          shareWithCommunity,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-serif text-2xl sm:text-3xl tracking-[0.1em] leading-relaxed">
            謝謝你停下來
            <br />
            看見自己。
          </p>
          <div
            className="mx-auto mt-10 w-24 h-px bg-gradient-to-r from-transparent via-ink-soft to-transparent"
            aria-hidden
          />
          <a
            href="/practice"
            className="inline-block mt-12 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark border-b border-rule pb-1"
          >
            回首頁
          </a>
        </div>
      </div>
    );
  }

  const dateForDisplay = (() => {
    const [y, m, d] = entryDate.split("-").map(Number);
    return `${y} 年 ${m} 月 ${d} 日`;
  })();
  const isToday = entryDate === todayIso;

  return (
    <article className="px-6 py-12 pb-24">
      <header className="mb-12">
        <h1 className="font-serif text-2xl sm:text-3xl tracking-[0.1em] leading-relaxed">
          今天身體怎麼樣？
        </h1>
        <div className="mt-4 flex items-baseline gap-3 font-sans text-xs tracking-[0.2em] text-ink-muted dark:text-ink-muted-dark">
          <span>{isToday ? `今天　${dateForDisplay}` : dateForDisplay}</span>
          <button
            type="button"
            onClick={() => setShowDatePicker((v) => !v)}
            className="underline underline-offset-4 hover:text-ink dark:hover:text-ink-dark"
          >
            {showDatePicker ? "收起" : "更改日期"}
          </button>
        </div>
        {showDatePicker && (
          <input
            type="date"
            value={entryDate}
            max={todayIso}
            onChange={(e) => setEntryDate(e.target.value)}
            className="mt-3 bg-transparent border border-rule px-3 py-2 text-sm focus:outline-none focus:border-ink dark:focus:border-ink-dark"
          />
        )}
      </header>

      <Section
        title="呼吸"
        leftLabel="卡住"
        rightLabel="流動"
        value={breathValue}
        onChange={setBreathValue}
        tagsTitle="今天的呼吸比較像"
        tagOptions={BREATH_TAGS}
        selectedTags={breathTags}
        onToggleTag={(t) => toggle(breathTags, t, setBreathTags)}
      />
      <Section
        title="身體"
        leftLabel="撐著"
        rightLabel="鬆開"
        value={bodyValue}
        onChange={setBodyValue}
        tagsTitle="今天比較容易感覺到"
        tagOptions={BODY_TAGS}
        selectedTags={bodyTags}
        onToggleTag={(t) => toggle(bodyTags, t, setBodyTags)}
      />
      <Section
        title="存在感"
        leftLabel="沉"
        rightLabel="輕"
        value={presenceValue}
        onChange={setPresenceValue}
        tagsTitle="今天的感受像"
        tagOptions={STATE_TAGS}
        selectedTags={stateTags}
        onToggleTag={(t) => toggle(stateTags, t, setStateTags)}
      />

      <FieldSeparator />
      <div className="mt-12">
        <p className="font-serif text-lg leading-relaxed">今天身體有什麼想說的？</p>
        <p className="mt-1 font-sans text-xs tracking-[0.15em] text-ink-soft dark:text-ink-muted-dark">
          （一句話也可以）
        </p>
        <textarea
          value={notesShape}
          onChange={(e) => setNotesShape(e.target.value)}
          rows={3}
          className="mt-3 w-full bg-transparent border border-rule dark:border-rule-dark px-3 py-3 text-base leading-relaxed focus:outline-none focus:border-ink dark:focus:border-ink-dark resize-y"
        />
      </div>

      <div className="mt-10">
        <p className="font-serif text-lg leading-relaxed">
          今天什麼時候撐著、什麼時候鬆開了？
        </p>
        <textarea
          value={notesMoment}
          onChange={(e) => setNotesMoment(e.target.value)}
          rows={3}
          className="mt-3 w-full bg-transparent border border-rule dark:border-rule-dark px-3 py-3 text-base leading-relaxed focus:outline-none focus:border-ink dark:focus:border-ink-dark resize-y"
        />
      </div>

      <FieldSeparator />
      <label className="mt-12 flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={shareWithAdmin}
          onChange={(e) => setShareWithAdmin(e.target.checked)}
          className="mt-1.5 accent-ink dark:accent-ink-dark"
        />
        <div>
          <p className="text-base">分享這次紀錄給太曦</p>
          <p className="mt-1 font-sans text-xs tracking-[0.1em] text-ink-soft dark:text-ink-muted-dark">
            勾了太曦才能在 session 時打開看。
          </p>
        </div>
      </label>

      <label className="mt-6 flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={shareWithCommunity}
          onChange={(e) => setShareWithCommunity(e.target.checked)}
          className="mt-1.5 accent-ink dark:accent-ink-dark"
        />
        <div>
          <p className="text-base">也讓其他個案匿名看到</p>
          <p className="mt-1 font-sans text-xs tracking-[0.1em] text-ink-soft dark:text-ink-muted-dark">
            勾了會匿名出現在「今日的分享」，不顯示你的名字。
          </p>
        </div>
      </label>

      <div className="mt-16 text-center">
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-block font-sans text-sm tracking-[0.3em] uppercase bg-ink text-paper dark:bg-ink-dark dark:text-paper-dark px-12 py-4 hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "送出中⋯" : "完成"}
        </button>
        {submitError && (
          <p className="mt-4 font-sans text-xs text-ink-muted dark:text-ink-muted-dark">
            送出失敗：{submitError}
          </p>
        )}
      </div>
    </article>
  );
}

function Section({
  title,
  leftLabel,
  rightLabel,
  value,
  onChange,
  tagsTitle,
  tagOptions,
  selectedTags,
  onToggleTag,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
  tagsTitle: string;
  tagOptions: string[];
  selectedTags: Set<string>;
  onToggleTag: (t: string) => void;
}) {
  return (
    <>
      <FieldSeparator />
      <section className="mt-12">
        <div className="flex items-baseline gap-4 mb-6">
          <h2 className="font-serif text-xl tracking-[0.1em]">{title}</h2>
          <span className="font-serif text-2xl tabular-nums text-ink-muted dark:text-ink-muted-dark">
            {value}
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <span className="font-sans text-xs tracking-[0.2em] text-ink-muted dark:text-ink-muted-dark">
            {leftLabel}
          </span>
          <Slider value={value} onChange={onChange} ariaLabel={title} />
          <span className="font-sans text-xs tracking-[0.2em] text-ink-muted dark:text-ink-muted-dark">
            {rightLabel}
          </span>
        </div>

        <p className="mt-8 font-sans text-xs tracking-[0.2em] text-ink-muted dark:text-ink-muted-dark">
          {tagsTitle}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tagOptions.map((t) => (
            <TagChip
              key={t}
              label={t}
              selected={selectedTags.has(t)}
              onToggle={() => onToggleTag(t)}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function FieldSeparator() {
  return (
    <div
      className="mt-12 w-16 h-px bg-gradient-to-r from-ink-soft to-transparent dark:from-ink-muted-dark"
      aria-hidden
    />
  );
}

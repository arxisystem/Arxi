"use client";

import { useEffect, useRef, useState } from "react";
import type { Voice } from "@/lib/voices";

type Props = {
  voices: Voice[];
};

export function VoicesCarousel({ voices }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0, dragged: false });
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // 隨捲動更新左右箭頭可用狀態
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // 用瀏覽器原生平滑捲動——它本來就跟 scroll-snap 協調運作，
  // 不要再手刻 rAF（會跟 snap 互打，造成「卡住→瞬間跳」）。
  const stepBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector("figure") as HTMLElement | null;
    const step = card ? card.offsetWidth + 32 : el.clientWidth * 0.8; // gap-8
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // 只用主鍵拖
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      scrollLeft: el.scrollLeft,
      dragged: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 3) dragStart.current.dragged = true;
    el.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    const el = scrollRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
  };

  // 拖曳結束時吞掉誤觸的點擊
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragStart.current.dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="relative">
      {/* 左三角按鈕 */}
      <button
        type="button"
        onClick={() => stepBy(-1)}
        disabled={!canLeft}
        aria-label="上一張"
        className={`flex absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-paper border border-rule rounded-full shadow-md hover:shadow-lg hover:bg-page transition-all duration-200 ${
          canLeft ? "opacity-100" : "opacity-30 cursor-not-allowed"
        }`}
      >
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          aria-hidden
          className="text-ink"
        >
          <polygon points="9,1 1,7 9,13" fill="currentColor" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        className={`overflow-x-auto snap-x snap-mandatory scrollbar-hide ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        style={{ touchAction: "pan-x" }}
      >
        <div className="flex gap-8 px-6 sm:px-12 py-4">
          {voices.map((voice) => (
            <figure
              key={voice.id}
              className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[45%] snap-start bg-page border border-rule shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-10 sm:p-12 flex flex-col justify-between min-h-[18rem]"
            >
              <blockquote className="text-2xl sm:text-3xl leading-relaxed tracking-[0.03em] select-none">
                「{voice.quote}」
              </blockquote>
              <figcaption className="mt-12 font-sans text-xs tracking-[0.3em] text-ink-soft uppercase select-none">
                {voice.name}
                <span className="mx-2">·</span>
                {voice.age}
                <span className="mx-2">·</span>
                {voice.occupation}
              </figcaption>
            </figure>
          ))}
          {/* 末端留白讓最後一張可貼齊左側 */}
          <div className="flex-shrink-0 w-1 sm:w-6" aria-hidden />
        </div>
      </div>

      {/* 右三角按鈕 */}
      <button
        type="button"
        onClick={() => stepBy(1)}
        disabled={!canRight}
        aria-label="下一張"
        className={`flex absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center bg-paper border border-rule rounded-full shadow-md hover:shadow-lg hover:bg-page transition-all duration-200 ${
          canRight ? "opacity-100" : "opacity-30 cursor-not-allowed"
        }`}
      >
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          aria-hidden
          className="text-ink"
        >
          <polygon points="1,1 9,7 1,13" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

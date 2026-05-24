// 三維度（呼吸/身體/存在）的折線圖。
// 設計：克制的色調、細線、空心點。不是 Apple Watch、是日記附圖。
// 鐵則 1 已撤回（spec §2 →）：可顯示數字、趨勢線。

type Point = {
  date: Date;
  breath: number | null;
  body: number | null;
  presence: number | null;
};

type Props = {
  points: Point[]; // 由舊到新排序
};

const DIMS = [
  { key: "breath", label: "呼吸", color: "var(--color-ink)" },
  { key: "body", label: "身體", color: "var(--color-ink-muted)" },
  { key: "presence", label: "存在", color: "var(--color-ink-soft)" },
] as const;

export function TrendChart({ points }: Props) {
  if (points.length === 0) {
    return (
      <p className="font-sans text-sm text-ink-muted dark:text-ink-muted-dark">
        還沒有紀錄。寫過幾天就會在這看到趨勢。
      </p>
    );
  }

  // SVG 範圍
  const W = 600;
  const H = 220;
  const PAD = { top: 16, right: 16, bottom: 36, left: 32 };

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  // X 軸：均勻分布每個 entry
  const xAt = (i: number) =>
    points.length === 1
      ? PAD.left + innerW / 2
      : PAD.left + (i / (points.length - 1)) * innerW;
  // Y 軸：value 1-10 → 反轉（1 在下、10 在上）
  const yAt = (v: number) => PAD.top + (1 - (v - 1) / 9) * innerH;

  const formatDate = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full min-w-[480px] h-auto"
        preserveAspectRatio="none"
        role="img"
        aria-label="呼吸/身體/存在 三維度折線趨勢圖"
      >
        {/* 背景格線：1/5/10 三條（不畫滿） */}
        {[1, 5, 10].map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yAt(v)}
              y2={yAt(v)}
              stroke="var(--color-rule)"
              strokeWidth="0.5"
              strokeDasharray={v === 5 ? "0" : "2 3"}
            />
            <text
              x={PAD.left - 6}
              y={yAt(v) + 3}
              textAnchor="end"
              className="fill-current text-[9px]"
              fill="var(--color-ink-soft)"
            >
              {v}
            </text>
          </g>
        ))}

        {/* X 軸日期 — 最多顯示 7 個 label，否則太擠 */}
        {points.map((p, i) => {
          const step = Math.max(1, Math.ceil(points.length / 7));
          if (i % step !== 0 && i !== points.length - 1) return null;
          return (
            <text
              key={i}
              x={xAt(i)}
              y={H - PAD.bottom + 16}
              textAnchor="middle"
              className="text-[9px]"
              fill="var(--color-ink-soft)"
            >
              {formatDate(p.date)}
            </text>
          );
        })}

        {/* 三條線 */}
        {DIMS.map(({ key, color }) => {
          // 連接所有非 null 的點
          const segments: string[] = [];
          let pending: string[] = [];
          points.forEach((p, i) => {
            const v = p[key];
            if (v == null) {
              if (pending.length) segments.push(pending.join(" "));
              pending = [];
              return;
            }
            pending.push(`${pending.length === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`);
          });
          if (pending.length) segments.push(pending.join(" "));
          return (
            <g key={key}>
              {segments.map((d, idx) => (
                <path
                  key={idx}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {/* 點 */}
              {points.map((p, i) => {
                const v = p[key];
                if (v == null) return null;
                return (
                  <circle
                    key={i}
                    cx={xAt(i)}
                    cy={yAt(v)}
                    r="2.5"
                    fill="var(--color-paper)"
                    stroke={color}
                    strokeWidth="1.25"
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* 圖例 */}
      <div className="mt-3 flex gap-5 font-sans text-xs tracking-[0.15em] text-ink-muted dark:text-ink-muted-dark">
        {DIMS.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="inline-block w-4 h-px"
              style={{ background: color, height: "1.5px" }}
              aria-hidden
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

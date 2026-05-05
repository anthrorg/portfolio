import { useEffect, useRef } from "react";

const PHRASE_PARTS = [
  "Mushoku Tensei: Jobless Reincarnation",
  "Jujutsu Kaisen",
  "Kaiju no 8",
  "Valheim",
  "The Witcher 3: Wild Hunt",
  "Elden Ring",
  "The Legend of Zelda: Breath of the Wild",
  "The Last of Us",
  "Splinter Cell: Chaos Theory",
  "The Elder Scrolls V: Skyrim",
  "The Elder Scrolls IV: Oblivion",
  "The Elder Scrolls III: Morrowind",
  "Palworld",
  "Fallout 3",
  "Fallout: New Vegas",
  "Fallout 4",
  "Fallout 76",
] as const;

const SEP = "    ·    ";
// 2 repeats × 17 phrases ≈ 7,400px per row — comfortably covers a 4K (3840px)
// viewport. Each extra repeat triples the per-row paint cost during shimmer
// (background-clip: text rasterizes the full row width every animation tick).
const REPEATS_PER_ROW = 2;
const ROW_COUNT = 80;

function shuffle<T>(arr: readonly T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Each row is REPEATS_PER_ROW independently-shuffled passes of PHRASE_PARTS,
// joined together. Rows differ from each other so the grid reads as scatter
// rather than a strict monogram. Computed once at module load — Vite SPA,
// no SSR, so Math.random() at top level has no hydration concern.
const ROWS = Array.from({ length: ROW_COUNT }, () =>
  Array.from({ length: REPEATS_PER_ROW }, () => shuffle(PHRASE_PARTS).join(SEP)).join(SEP),
);

// Negative random delays in [-CYCLE, 0] so every row starts already at a random
// point in its shimmer cycle (no dead window after page load before first shimmer).
// Keep this in sync with --bg-text-shimmer-cycle in theme.css.
const SHIMMER_CYCLE_SECONDS = 50;
const SHIMMER_DELAYS = Array.from(
  { length: ROW_COUNT },
  () => -Math.random() * SHIMMER_CYCLE_SECONDS,
);

export function BackgroundText() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip listener on touch / no-hover devices and under reduced motion —
    // CSS hides the bright layer in those cases, so the work would be wasted.
    const idle = window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)");
    if (idle.matches) return;

    let frame = 0;
    let nx = 0;
    let ny = 0;

    const onMove = (e: MouseEvent) => {
      nx = e.clientX;
      ny = e.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${nx}px`);
        el.style.setProperty("--my", `${ny}px`);
        frame = 0;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      <div className="bg-text-grid bg-text-dim absolute inset-0">
        {ROWS.map((row, i) => (
          <div key={i}>{row}</div>
        ))}
      </div>
      <div className="bg-text-grid bg-text-bright absolute inset-0">
        {ROWS.map((row, i) => (
          <div key={i} style={{ animationDelay: `${SHIMMER_DELAYS[i]}s` }}>
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

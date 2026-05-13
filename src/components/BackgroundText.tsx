import { useEffect, useRef, useState } from "react";

import { isPrerender } from "@/lib/is-prerender";

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

// Keep in sync with --bg-text-shimmer-cycle in theme.css. Negative random
// delays in [-CYCLE, 0] start each row mid-shimmer (no dead window on load).
const SHIMMER_CYCLE_SECONDS = 50;

type Content = { rows: string[]; delays: number[] };

// Rows are generated on the client after hydration, and skipped entirely
// during the build-time prerender crawl. This keeps the prerendered HTML free
// of the ~157KB decorative text wall — crawlers, link-preview bots, and AI
// fetchers that strip HTML to plain text don't honor aria-hidden, so rendering
// the marquee at build time drowns out the real page copy.
function buildContent(): Content {
  const rows = Array.from({ length: ROW_COUNT }, () =>
    Array.from({ length: REPEATS_PER_ROW }, () => shuffle(PHRASE_PARTS).join(SEP)).join(SEP),
  );
  const delays = Array.from(
    { length: ROW_COUNT },
    () => -Math.random() * SHIMMER_CYCLE_SECONDS,
  );
  return { rows, delays };
}

export function BackgroundText() {
  const ref = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    if (isPrerender()) return;
    setContent(buildContent());
  }, []);

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
      {content && (
        <>
          <div className="bg-text-grid bg-text-dim absolute inset-0">
            {content.rows.map((row, i) => (
              <div key={i}>{row}</div>
            ))}
          </div>
          <div className="bg-text-grid bg-text-bright absolute inset-0">
            {content.rows.map((row, i) => (
              <div key={i} style={{ animationDelay: `${content.delays[i]}s` }}>
                {row}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

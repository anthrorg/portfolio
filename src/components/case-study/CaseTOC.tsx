import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/cn";

type TOCItem = {
  id: string;
  text: string;
};

/**
 * In-page table of contents for case-study H2s.
 *
 * Renders nothing during SSR/prerender — the MDX article DOM doesn't exist
 * at snapshot time, so there's nothing to index. After mount on the client
 * we read `article h2` (rehype-slug guarantees each one has an `id`),
 * filter out any that for some reason lack an id, and skip rendering
 * entirely if fewer than 3 headings qualify.
 *
 * Active-heading highlight uses IntersectionObserver. The rootMargin
 * `-20% 0px -75% 0px` makes a heading "active" once it crosses into the
 * upper portion of the viewport (between 20% and 75% from the top), which
 * mirrors how a reader actually consumes the article — the heading at the
 * current reading position, not the next one barely poking in from the
 * bottom.
 *
 * Layout: a `<details>` block on small screens (default closed, can be
 * opened to peek). A sticky right-rail sidebar on `lg+` screens. Both
 * variants share the same anchor markup so keyboard / screen-reader
 * navigation works identically.
 */
export function CaseTOC() {
  const { t } = useTranslation();
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Build the TOC after mount. The MDX content is lazy-loaded via
  // React.Suspense in the parent route (`routes/work/$slug.tsx`), which
  // means on first effect tick the <article> may be empty — the H2s
  // haven't been rendered yet. A naive one-shot effect captures zero
  // headings and the TOC stays hidden.
  //
  // We watch <article> with a MutationObserver: each time its subtree
  // changes (Suspense resolves, MDX inserts headings), we re-scan.
  // Once the heading count stabilises at a non-zero value across two
  // consecutive observations we disconnect — keeping the observer alive
  // for the page's lifetime would mean re-scanning on every later DOM
  // mutation (image loads, syntax-highlighting, etc.) for no benefit.
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const scan = (): TOCItem[] => {
      const headings = Array.from(
        article.querySelectorAll<HTMLHeadingElement>("h2"),
      );
      const next: TOCItem[] = [];
      for (const h of headings) {
        if (!h.id) continue;
        const text = (h.textContent ?? "").trim();
        if (!text) continue;
        next.push({ id: h.id, text });
      }
      return next;
    };

    let lastCount = 0;
    let mo: MutationObserver | null = null;

    const apply = () => {
      const next = scan();
      if (next.length !== lastCount) {
        lastCount = next.length;
        setItems(next);
      } else if (next.length > 0 && mo) {
        // Count is stable at a non-zero value — MDX content has settled;
        // further mutation events (image loads, syntax highlighting)
        // can't change the H2 list, so stop observing.
        mo.disconnect();
        mo = null;
      }
    };

    apply();

    mo = new MutationObserver(apply);
    mo.observe(article, { childList: true, subtree: true });

    return () => {
      if (mo) mo.disconnect();
    };
  }, []);

  // Observe headings for active-section highlighting. Re-runs when items
  // are populated.
  useEffect(() => {
    if (items.length === 0) return;
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost entry currently intersecting. If multiple
        // are intersecting, the one with the smallest top boundary wins.
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        const first = visible[0];
        if (first && first.target.id) {
          setActiveId(first.target.id);
        }
      },
      { rootMargin: "-20% 0px -75% 0px" },
    );

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [items]);

  // Don't render until we have at least 3 entries. This keeps short pages
  // (the Sylphie thesis page is on the boundary) from showing a stubby TOC.
  if (items.length < 3) return null;

  return (
    <>
      {/* Mobile: collapsible, sits above the article body. */}
      <details className="mb-10 rounded-2xl border border-border bg-surface px-5 py-3 lg:hidden">
        <summary className="cursor-pointer list-none font-mono text-xs uppercase tracking-widest text-ink-muted">
          {t("work.tocLabel")}
        </summary>
        <nav
          aria-label={t("work.tocNavLabel")}
          className="mt-4 border-t border-border pt-4"
        >
          <TOCList items={items} activeId={activeId} />
        </nav>
      </details>

      {/* Desktop: sticky right-rail. Sits in the grid column the layout
          allocates for it.
          Sticky must live on the grid cell itself, not the inner <nav>:
          the parent grid uses `items-start` so each row item shrinks to
          its content; an inner sticky element ends up with zero track and
          scrolls with the page. The grid cell, being row-stretched, gets
          a sticky offset against the viewport and stays pinned.
          A plain <div> rather than <aside> on purpose — nesting a
          complementary landmark inside <article> trips axe's
          landmark-complementary-is-top-level rule. The labelled <nav>
          inside is the real semantic landmark. */}
      <div
        className="sticky top-24 hidden max-h-[calc(100vh-8rem)] self-start overflow-y-auto pr-2 lg:block"
      >
        <nav aria-label={t("work.tocNavLabel")}>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t("work.tocLabel")}
          </p>
          <TOCList items={items} activeId={activeId} />
        </nav>
      </div>
    </>
  );
}

function TOCList({
  items,
  activeId,
}: {
  items: TOCItem[];
  activeId: string | null;
}) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block border-l-2 py-1 pl-3 leading-snug transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:border-border hover:text-ink",
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

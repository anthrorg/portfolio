export type CaseSlug =
  | "sylphie"
  | "memory-pkg"
  | "sylphie-pkg"
  | "enforcement-hooks"
  | "procedural-knowledge-graphs";

export type CaseMeta = {
  slug: CaseSlug;
  featured: boolean;
  year: string;
  stack: readonly string[];
  comingSoon?: boolean;
  /**
   * Public repo URL surfaced on the engineer card. `null` renders a
   * "Repo coming soon" placeholder; wire a real URL once the repo is public.
   * Ignored when `noRepo` is true.
   */
  repoUrl?: string | null;
  /**
   * Case studies that intentionally have no standalone repo to ship — the
   * write-up is informational. When true, the engineer card omits the
   * repo CTA and the "coming soon" placeholder entirely.
   */
  noRepo?: boolean;
  /** Published npm package name (scoped). Drives the npm badge on cards. */
  npmPackage?: string;
  /** Public production URL. Drives the live-status tag on the flagship card. */
  liveUrl?: string;
  /**
   * Home-page curation. The rule: a home card requires a verifiable
   * artifact — a live URL, an npm package, or a public repo. Essays
   * (e.g. procedural-knowledge-graphs) live on the index only.
   */
  homeCard?: "flagship" | "tool";
};

export const cases: readonly CaseMeta[] = [
  {
    slug: "sylphie",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "Node", "CANON"],
    repoUrl: null,
    liveUrl: "https://sylphie.live",
    homeCard: "flagship",
  },
  {
    slug: "memory-pkg",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "TimescaleDB", "Postgres trigram", "MCP"],
    repoUrl: "https://github.com/Sylphie-Labs/memory-pkg",
    npmPackage: "@sylphie-labs/memory-pkg",
    homeCard: "tool",
  },
  {
    slug: "sylphie-pkg",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "Neo4j", "ts-morph", "MCP"],
    repoUrl: "https://github.com/Sylphie-Labs/codebase-pkg",
    npmPackage: "@sylphie-labs/codebase-pkg",
    homeCard: "tool",
  },
  {
    slug: "enforcement-hooks",
    featured: true,
    year: "2026",
    stack: ["Bash", "Claude Code hooks", "Sonnet", "Playwright"],
    noRepo: true,
    homeCard: "tool",
  },
  {
    slug: "procedural-knowledge-graphs",
    featured: true,
    year: "2026",
    stack: ["Architecture", "AI", "Systems Design"],
    noRepo: true,
  },
] as const;

export function getCase(slug: string): CaseMeta | undefined {
  return cases.find((c) => c.slug === slug);
}

export function getAdjacentCases(slug: string): {
  prev: CaseMeta | undefined;
  next: CaseMeta | undefined;
} {
  const idx = cases.findIndex((c) => c.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? cases[idx - 1] : undefined,
    next: idx < cases.length - 1 ? cases[idx + 1] : undefined,
  };
}

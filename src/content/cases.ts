export type CaseSlug =
  | "sylphie"
  | "memory-pkg"
  | "sylphie-pkg"
  | "enforcement-hooks";

export type CaseMeta = {
  slug: CaseSlug;
  featured: boolean;
  year: string;
  stack: readonly string[];
  comingSoon?: boolean;
  /**
   * Public repo URL surfaced on the engineer card. `null` renders a
   * "Repo coming soon" placeholder; wire a real URL once the repo is public.
   */
  repoUrl?: string | null;
};

export const cases: readonly CaseMeta[] = [
  {
    slug: "sylphie",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "Node", "CANON"],
    repoUrl: null,
  },
  {
    slug: "memory-pkg",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "TimescaleDB", "Postgres trigram", "MCP"],
    repoUrl: "https://github.com/Sylphie-Labs/memory-pkg",
  },
  {
    slug: "sylphie-pkg",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "Neo4j", "ts-morph", "MCP"],
    repoUrl: "https://github.com/Sylphie-Labs/codebase-pkg",
  },
  {
    slug: "enforcement-hooks",
    featured: true,
    year: "2026",
    stack: ["Bash", "Claude Code hooks", "Sonnet", "Playwright"],
    repoUrl: null,
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

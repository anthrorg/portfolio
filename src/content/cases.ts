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
};

export const cases: readonly CaseMeta[] = [
  {
    slug: "sylphie",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "Node", "CANON"],
  },
  {
    slug: "memory-pkg",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "TimescaleDB", "Postgres trigram", "MCP"],
  },
  {
    slug: "sylphie-pkg",
    featured: true,
    year: "2026",
    stack: ["TypeScript", "Neo4j", "ts-morph", "MCP"],
  },
  {
    slug: "enforcement-hooks",
    featured: true,
    year: "2026",
    stack: ["Bash", "Claude Code hooks", "Sonnet", "Playwright"],
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

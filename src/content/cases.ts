export type CaseSlug = "sylphie";

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

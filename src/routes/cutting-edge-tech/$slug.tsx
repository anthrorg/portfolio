import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { getCase } from "@/content/cases";
import { useHead } from "@/lib/use-head";

// HISTORICAL: the MDX directory stays at src/content/work/. Only the URL
// path renamed to /work → /frontier → /cutting-edge-tech (2026-05) — the
// on-disk content location is internal-only and renaming it would churn
// imports across the repo.
const caseModules = import.meta.glob<{ default: ComponentType }>(
  "@/content/work/*.mdx",
);

const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>();

function getLazyCase(slug: string): LazyExoticComponent<ComponentType> | null {
  const path = `/src/content/work/${slug}.mdx`;
  const loader = caseModules[path];
  if (!loader) return null;
  let cached = lazyCache.get(path);
  if (!cached) {
    cached = lazy(loader);
    lazyCache.set(path, cached);
  }
  return cached;
}

function CaseStudy() {
  const { t } = useTranslation();
  const { slug } = Route.useParams();
  const meta = getCase(slug);
  useHead({
    title: meta ? t(`work.cases.${slug}.title`) : undefined,
    description: meta ? t(`work.cases.${slug}.summary`) : "",
    path: `/cutting-edge-tech/${slug}`,
    ogType: "article",
  });
  if (!meta) throw notFound();

  const MDXContent = getLazyCase(slug);

  return (
    <CaseStudyLayout meta={meta} stack={meta.stack}>
      {MDXContent ? (
        <Suspense fallback={null}>
          <MDXContent />
        </Suspense>
      ) : (
        <p className="mt-6 max-w-prose text-base leading-relaxed text-ink-muted md:text-lg">
          {t("work.caseComingSoon")}
        </p>
      )}
    </CaseStudyLayout>
  );
}

export const Route = createFileRoute("/cutting-edge-tech/$slug")({
  component: CaseStudy,
});

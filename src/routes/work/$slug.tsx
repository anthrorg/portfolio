import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { getCase } from "@/content/cases";
import { useDocumentTitle } from "@/lib/use-document-title";

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
  useDocumentTitle(meta ? t(`work.cases.${slug}.title`) : undefined);
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

export const Route = createFileRoute("/work/$slug")({
  component: CaseStudy,
});

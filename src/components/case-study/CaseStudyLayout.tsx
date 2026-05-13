import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import {
  cases,
  getAdjacentCases,
  type CaseMeta,
} from "@/content/cases";
import { useViewTransitionEnabled } from "@/lib/use-view-transition";
import { CaseTOC } from "./CaseTOC";
import { mdxComponents } from "./mdx-components";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type CaseStudyLayoutProps = {
  meta: CaseMeta;
  stack: readonly string[];
  children: ReactNode;
};

export function CaseStudyLayout({
  meta,
  stack,
  children,
}: CaseStudyLayoutProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const viewTransition = useViewTransitionEnabled();
  const { prev, next } = getAdjacentCases(meta.slug);
  const related = cases.filter((c) => c.slug !== meta.slug);

  return (
    <Container className="py-16 md:py-24">
      <Link
        to="/work"
        viewTransition={viewTransition}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span>
        <span>{t("work.backToWork")}</span>
      </Link>

      <motion.header
        className="mt-12 border-b border-border pb-12 md:pb-20"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t(`work.cases.${meta.slug}.role`)}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {meta.year}
          </span>
        </div>

        <h1 className="mt-10 font-display tracking-tight leading-[1.02] text-[clamp(2.5rem,8vw,6rem)]">
          {t(`work.cases.${meta.slug}.title`)}
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-ink-muted md:text-xl">
          {t(`work.cases.${meta.slug}.summary`)}
        </p>

        {stack.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest text-ink-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </motion.header>

      {/*
       * Article body + TOC.
       *
       * Mobile (< lg): single column. The TOC renders inline above the
       * prose as a collapsed <details>; the prose follows below.
       *
       * Desktop (lg+): a two-column grid — the prose column constrained
       * by its own `max-w-prose` utilities (set in mdx-components.tsx),
       * and a 14rem TOC sidebar that sticks to the viewport as the reader
       * scrolls. `items-start` keeps the sticky TOC anchored to the top
       * of the row rather than centering vertically against the long
       * article.
       *
       * The TOC mounts once — its IntersectionObserver and active-state
       * are single-sourced — and internally renders either its mobile
       * <details> form or its desktop <aside> form via Tailwind
       * breakpoints. See CaseTOC.tsx for the mechanics.
       */}
      <article className="mt-12 md:mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-12">
        <div className="contents lg:block">
          <MDXProvider components={mdxComponents}>{children}</MDXProvider>
        </div>
        <CaseTOC />
      </article>

      <RelatedWork
        related={related}
        reduced={!!reduced}
        viewTransition={viewTransition}
      />

      <nav
        className="mt-20 grid gap-px border-y border-border py-10 md:grid-cols-2"
        aria-label={t("work.caseNavLabel")}
      >
        {prev ? (
          <CaseNavLink
            direction="previous"
            target={prev}
            viewTransition={viewTransition}
          />
        ) : (
          <span aria-hidden />
        )}
        {next ? (
          <CaseNavLink
            direction="next"
            target={next}
            viewTransition={viewTransition}
          />
        ) : (
          <span aria-hidden />
        )}
      </nav>
    </Container>
  );
}

function CaseNavLink({
  direction,
  target,
  viewTransition,
}: {
  direction: "previous" | "next";
  target: CaseMeta;
  viewTransition: boolean;
}) {
  const { t } = useTranslation();
  const isNext = direction === "next";

  return (
    <Link
      to="/work/$slug"
      params={{ slug: target.slug }}
      viewTransition={viewTransition}
      className={`group block py-6 transition-colors hover:text-accent ${
        isNext ? "md:text-right" : ""
      }`}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
        {isNext ? t("work.next") : t("work.previous")}
      </span>
      <span className="mt-2 block font-display text-2xl tracking-tight md:text-3xl">
        {t(`work.cases.${target.slug}.title`)}
      </span>
    </Link>
  );
}

function RelatedWork({
  related,
  reduced,
  viewTransition,
}: {
  related: readonly CaseMeta[];
  reduced: boolean;
  viewTransition: boolean;
}) {
  const { t } = useTranslation();
  // Defensive: if this is the only case in the set, there's nothing to
  // link to. (Won't fire with the current three-case set, but keeps the
  // contract honest as cases come and go.)
  if (related.length === 0) return null;

  // Column count scales with sibling count so the grid never ends with
  // an orphan card on a half-empty row:
  //   1 sibling  → full-width single card (no grid columns)
  //   2 siblings → 2-up on md+
  //   3+         → 2-up on md, 3-up on lg+ (with 4 total cases the page
  //                always has 3 siblings, so this is the live path)
  // Mobile always stacks (no column count below md).
  const headingId = "related-work-heading";
  const gridCols =
    related.length === 1
      ? ""
      : related.length === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <motion.section
      aria-labelledby={headingId}
      className="mt-20 border-t border-border pt-12"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <h2
        id={headingId}
        className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm"
      >
        {t("work.relatedHeading")}
      </h2>
      <ul className={`mt-8 grid gap-6 ${gridCols}`}>
        {related.map((meta) => (
          <li key={meta.slug}>
            <RelatedCard meta={meta} viewTransition={viewTransition} />
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

function RelatedCard({
  meta,
  viewTransition,
}: {
  meta: CaseMeta;
  viewTransition: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Link
      to="/work/$slug"
      params={{ slug: meta.slug }}
      viewTransition={viewTransition}
      className="group relative block h-full rounded-3xl border border-border p-6 transition-colors hover:bg-surface md:p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          {t(`work.cases.${meta.slug}.role`)}
        </span>
        <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          {meta.year}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl tracking-tight md:text-3xl">
        {t(`work.cases.${meta.slug}.title`)}
      </h3>
      <p className="mt-3 max-w-md text-sm text-ink-muted md:text-base">
        {t(`work.cases.${meta.slug}.summary`)}
      </p>
      <span className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-ink-muted transition-colors group-hover:text-accent">
        <span>{t("work.viewCase")}</span>
        <span
          aria-hidden
          className="block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-14"
        />
      </span>
    </Link>
  );
}

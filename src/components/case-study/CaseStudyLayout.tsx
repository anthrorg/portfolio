import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { getAdjacentCases, type CaseMeta } from "@/content/cases";
import { useViewTransitionEnabled } from "@/lib/use-view-transition";
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

      <article className="mt-12 md:mt-16">
        <MDXProvider components={mdxComponents}>{children}</MDXProvider>
      </article>

      <nav
        className="mt-20 grid gap-px border-y border-border py-10 md:grid-cols-2"
        aria-label={t("work.title")}
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

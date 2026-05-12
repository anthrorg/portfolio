import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { cases, type CaseMeta } from "@/content/cases";
import { useHead } from "@/lib/use-head";
import { useViewTransitionEnabled } from "@/lib/use-view-transition";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

function WorkIndex() {
  const { t } = useTranslation();
  useHead({
    title: t("nav.work"),
    description: t("meta.work"),
    path: "/work",
  });
  const featured = cases.find((c) => c.featured);
  const supporting = cases.filter((c) => !c.featured);
  const reduced = useReducedMotion();
  const viewTransition = useViewTransitionEnabled();

  return (
    <Container className="py-24 md:py-32">
      <motion.header
        className="max-w-3xl"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("work.title")}
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {t("work.intro")}
        </h1>
      </motion.header>

      {featured && (
        <FeaturedCase
          meta={featured}
          delay={reduced ? 0 : 0.2}
          reduced={!!reduced}
          viewTransition={viewTransition}
        />
      )}

      <div className="mt-8 grid md:mt-12 md:grid-cols-2">
        {supporting.map((meta, i) =>
          meta.comingSoon ? (
            <ComingSoonCase
              key={meta.slug}
              meta={meta}
              index={i}
              reduced={!!reduced}
            />
          ) : (
            <SupportingCase
              key={meta.slug}
              meta={meta}
              index={i}
              reduced={!!reduced}
              viewTransition={viewTransition}
            />
          ),
        )}
      </div>
    </Container>
  );
}

type CardProps = {
  meta: CaseMeta;
  reduced: boolean;
  viewTransition: boolean;
};

function FeaturedCase({
  meta,
  delay,
  reduced,
  viewTransition,
}: CardProps & { delay: number }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      className="mt-20"
    >
      <Link
        to="/work/$slug"
        params={{ slug: meta.slug }}
        viewTransition={viewTransition}
        className="group relative block overflow-hidden rounded-3xl border border-border bg-surface p-8 md:p-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-60"
        />
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-accent/40 bg-bg px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-accent">
            {t("work.featuredLabel")}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {meta.year}
          </span>
        </div>

        <h2 className="mt-12 font-display text-5xl leading-[1.05] tracking-tight md:text-8xl">
          <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
            {t(`work.cases.${meta.slug}.title`)}
          </span>
        </h2>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-2xl text-base text-ink-muted md:text-lg">
            {t(`work.cases.${meta.slug}.summary`)}
          </p>
          <span className="inline-flex items-center gap-3 self-start text-sm uppercase tracking-widest md:self-auto">
            <span>{t("work.viewCase")}</span>
            <span
              aria-hidden
              className="block h-px w-12 bg-current transition-[width] duration-500 ease-out group-hover:w-20"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function SupportingCase({
  meta,
  index,
  reduced,
  viewTransition,
}: CardProps & { index: number }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: reduced ? 0 : 0.4 + 0.1 * index,
        ease: EASE_OUT,
      }}
      className="border-b border-border md:border-b-0 md:px-1 md:[&:not(:last-child)]:border-r"
    >
      <Link
        to="/work/$slug"
        params={{ slug: meta.slug }}
        viewTransition={viewTransition}
        className="group relative block h-full rounded-3xl py-10 transition-colors hover:bg-surface md:px-8 md:py-12"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t(`work.cases.${meta.slug}.role`)}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {meta.year}
          </span>
        </div>
        <h3 className="mt-6 font-display text-3xl tracking-tight md:text-5xl">
          {t(`work.cases.${meta.slug}.title`)}
        </h3>
        <p className="mt-4 text-sm text-ink-muted md:text-base">
          {t(`work.cases.${meta.slug}.summary`)}
        </p>
        <span className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-ink-muted transition-colors group-hover:text-accent">
          <span>{t("work.viewCase")}</span>
          <span
            aria-hidden
            className="block h-px w-8 bg-current transition-[width] duration-500 ease-out group-hover:w-14"
          />
        </span>
      </Link>
    </motion.div>
  );
}

type ComingSoonCaseProps = {
  meta: CaseMeta;
  index: number;
  reduced: boolean;
};

function ComingSoonCase({ meta, index, reduced }: ComingSoonCaseProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: reduced ? 0 : 0.4 + 0.1 * index,
        ease: EASE_OUT,
      }}
      className="border-b border-border md:border-b-0 md:px-1 md:[&:not(:last-child)]:border-r"
    >
      <div className="block h-full py-10 md:px-8 md:py-12">
        <div className="flex items-baseline justify-between gap-4">
          <span className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-ink-muted">
            {t("work.comingSoonLabel")}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {meta.year}
          </span>
        </div>
        <h3 className="mt-6 font-display text-3xl tracking-tight text-ink-muted md:text-5xl">
          {t(`work.cases.${meta.slug}.title`)}
        </h3>
        <p className="mt-4 max-w-md text-sm text-ink-muted md:text-base">
          {t(`work.cases.${meta.slug}.summary`)}
        </p>
      </div>
    </motion.div>
  );
}

export const Route = createFileRoute("/work/")({
  component: WorkIndex,
});

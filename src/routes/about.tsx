import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { useHead } from "@/lib/use-head";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const lineVariants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.9,
      ease: EASE_OUT,
    },
  },
} as const;

const eyebrowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
} as const;

const fadeUpVariants = (delay: number) =>
  ({
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: EASE_OUT },
    },
  }) as const;

/**
 * Trajectory rail nodes, oldest first. Each key maps to an
 * `about.rail.roles.<key>.{years,org,role,receipt}` quad in i18n.
 * The Sylphie node carries the live accent dot.
 */
const RAIL_KEYS = ["lam", "tek", "mediavine", "sylphie"] as const;

const RAIL_BASE_DELAY = 0.45;
const RAIL_STAGGER = 0.06;

/**
 * Trajectory page — five bands: identity + receipts, trajectory rail,
 * method, open-to, off-hours coda. Everything animates on mount — no
 * whileInView, so nothing below the fold can get stuck at opacity 0.
 */
function About() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  useHead({
    title: t("nav.about"),
    description: t("meta.about"),
    path: "/about",
  });

  return (
    <Container className="py-16 md:py-24">
      {/* Band 1 — identity + receipts */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
        <header className="lg:col-span-7">
          <motion.p
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={eyebrowVariants}
            className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm"
          >
            {t("about.eyebrow")}
          </motion.p>

          <h1 className="font-display leading-[1.05] tracking-tight text-[clamp(2.25rem,4.2vw,3.75rem)]">
            <span className="block overflow-hidden pr-1">
              <motion.span
                className="block"
                initial={reduced ? false : "hidden"}
                animate="visible"
                variants={lineVariants}
              >
                {t("about.title")}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={fadeUpVariants(0.25)}
            className="mt-6 max-w-xl text-base text-ink-muted md:text-lg"
          >
            {t("about.lede")}
          </motion.p>
        </header>

        <motion.div
          initial={reduced ? false : "hidden"}
          animate="visible"
          variants={fadeUpVariants(0.35)}
          className="text-plate p-6 md:p-8 lg:col-span-5"
        >
          <p
            id="about-receipts-label"
            className="font-mono text-xs uppercase tracking-widest text-ink-muted"
          >
            {t("home.proof.label")}
          </p>
          <ul
            aria-labelledby="about-receipts-label"
            className="mt-4 space-y-2.5 font-mono text-xs uppercase tracking-widest"
          >
            <li>{t("home.proof.years")}</li>
            <li>{t("home.proof.mediavine")}</li>
            <li>
              <a
                href="https://www.npmjs.com/package/@sylphie-labs/memory-pkg"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("home.proof.npmMemory")}
              </a>
            </li>
            <li>
              <a
                href="https://www.npmjs.com/package/@sylphie-labs/codebase-pkg"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("home.proof.npmCodebase")}
              </a>
            </li>
            <li>
              <a
                href="https://sylphie.live"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("home.proof.live")}
              </a>
            </li>
            <li>
              <Link
                to="/cutting-edge-tech"
                className="transition-colors hover:text-accent"
              >
                {t("about.receipts.cases")}
              </Link>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Band 2 — trajectory rail */}
      <section className="mt-14 md:mt-20">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="visible"
          variants={fadeUpVariants(RAIL_BASE_DELAY)}
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
              {t("about.rail.eyebrow")}
            </p>
            <Link
              to="/career"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-accent"
            >
              <span>{t("about.rail.cta")}</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div
            aria-hidden
            className="mt-4 h-px bg-gradient-to-r from-gradient-start to-gradient-end"
          />
        </motion.div>

        <ol
          aria-label="Career timeline"
          className="mt-6 divide-y divide-border lg:grid lg:grid-cols-4 lg:gap-6 lg:divide-y-0"
        >
          {RAIL_KEYS.map((key, i) => (
            <motion.li
              key={key}
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={fadeUpVariants(RAIL_BASE_DELAY + RAIL_STAGGER * i)}
              className="py-5 first:pt-0 last:pb-0 lg:py-0"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                {key === "sylphie" && (
                  <span aria-hidden className="accent-dot-glow text-accent">
                    ●{" "}
                  </span>
                )}
                {t(`about.rail.roles.${key}.years`)}
              </p>
              <p className="mt-2 font-display text-lg tracking-tight">
                {t(`about.rail.roles.${key}.org`)}
              </p>
              <p className="mt-1 text-sm">{t(`about.rail.roles.${key}.role`)}</p>
              <p className="mt-2 text-sm text-ink-muted">
                {t(`about.rail.roles.${key}.receipt`)}
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Band 3 — method */}
      <section className="mt-14 md:mt-20">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="visible"
          variants={fadeUpVariants(0.55)}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
            {t("about.method.eyebrow")}
          </p>
          <h2 className="mt-4 font-display text-2xl tracking-tight md:text-3xl">
            {t("home.methodLine")}
          </h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {(["discipline", "patience"] as const).map((key, i) => (
            <motion.div
              key={key}
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={fadeUpVariants(0.6 + 0.07 * i)}
              className="text-plate p-6 md:p-8 lg:col-span-6"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                {t(`about.method.${key}.eyebrow`)}
              </p>
              <h3 className="mt-4 font-display text-xl tracking-tight md:text-2xl">
                {t(`about.method.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
                {t(`about.method.${key}.body`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Band 4 — open to */}
      <motion.section
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={fadeUpVariants(0.75)}
        className="text-plate mt-14 p-8 md:mt-20 md:p-12"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          <span aria-hidden className="accent-dot-glow text-accent">
            ●{" "}
          </span>
          {t("home.openEyebrow")}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-4xl">
              {t("about.next.title")}
            </h2>
            <p className="mt-5 max-w-xl text-base text-ink-muted md:text-lg">
              {t("about.next.body")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:col-span-5">
            <div>
              <p
                id="about-open-also-label"
                className="mb-1.5 font-mono text-xs uppercase tracking-widest text-ink-muted"
              >
                {t("home.openAlsoLabel")}
              </p>
              {/* Fallback roles in priority order below the primary. */}
              <ol
                aria-labelledby="about-open-also-label"
                className="space-y-1 font-display text-lg leading-snug text-ink-muted"
              >
                {(["home.openRole2", "home.openRole3"] as const).map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ol>
            </div>
            <dl className="hidden grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1 min-[480px]:grid">
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                {t("home.openLocationLabel")}
              </dt>
              <dd className="text-sm">{t("home.openLocation")}</dd>
              <dt className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                {t("home.openReloLabel")}
              </dt>
              <dd className="text-sm">{t("home.openRelo")}</dd>
            </dl>
            <a
              href={`mailto:${t("home.openEmail")}`}
              className="mt-auto inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
            >
              <span>{t("home.openCta")}</span>
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Band 5 — off-hours coda */}
      <motion.div
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={fadeUpVariants(0.85)}
        className="mt-14 border-t border-border pt-14 text-center md:mt-20 md:pt-16"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("about.offhours.eyebrow")}
        </p>
        <p className="mt-4 font-display text-xl italic tracking-tight md:text-2xl">
          {t("about.offhours.line")}
        </p>
      </motion.div>
    </Container>
  );
}

export const Route = createFileRoute("/about")({
  component: About,
});

import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";

import { cases, type CaseMeta, type CaseSlug } from "@/content/cases";

import { Container } from "./Container";

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

/** Tool-row npm badges: proof-strip label key per slug. URL derives from meta.npmPackage. */
const NPM_BADGE_KEYS: Partial<Record<CaseSlug, "npmMemory" | "npmCodebase">> = {
  "memory-pkg": "npmMemory",
  "sylphie-pkg": "npmCodebase",
};

/**
 * One-screen editorial bento. Bands 1–3 (identity + status, flagship +
 * tools, receipts) fit the first screen at 1440×900; band 4 (method coda)
 * is the only below-fold content. Everything animates on mount — no
 * whileInView, so nothing below the fold can get stuck at opacity 0.
 */
export function HomeBento() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  const flagship = cases.find((meta) => meta.homeCard === "flagship");
  const tools = cases.filter((meta) => meta.homeCard === "tool");

  return (
    <>
      <section className="pt-10 pb-12 md:pt-12 md:pb-16">
        <Container>
          {/* Band 1 — identity / status */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
              <motion.p
                initial={reduced ? false : "hidden"}
                animate="visible"
                variants={eyebrowVariants}
                className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm"
              >
                {t("hero.eyebrow")}
              </motion.p>

              <h1 className="font-display leading-[1.05] tracking-tight text-[clamp(2.25rem,4.6vw,4.125rem)]">
                <span className="block overflow-hidden pr-1">
                  <motion.span
                    className="block"
                    initial={reduced ? false : "hidden"}
                    animate="visible"
                    variants={lineVariants}
                  >
                    <Trans
                      i18nKey="hero.tagline"
                      components={{
                        highlight: <span className="italic" />,
                      }}
                    />
                  </motion.span>
                </span>
              </h1>

              <motion.p
                initial={reduced ? false : "hidden"}
                animate="visible"
                variants={fadeUpVariants(0.25)}
                className="mt-6 max-w-xl text-base text-ink-muted md:text-lg"
              >
                {t("hero.subhead")}
              </motion.p>
            </div>

            <motion.div
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={fadeUpVariants(0.35)}
              className="text-plate flex flex-col items-start gap-4 p-6 md:p-8 lg:col-span-5"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                <span aria-hidden className="text-accent">
                  ●{" "}
                </span>
                {t("home.openEyebrow")}
              </p>
              <h2 className="font-display text-2xl leading-tight tracking-tight">
                {t("home.openTitle")}
              </h2>
              <div>
                <p
                  id="open-also-label"
                  className="mb-1.5 font-mono text-xs uppercase tracking-widest text-ink-muted"
                >
                  {t("home.openAlsoLabel")}
                </p>
                {/* Fallback roles in priority order below the primary. */}
                <ol
                  aria-labelledby="open-also-label"
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
            </motion.div>
          </div>

          {/* Band 2 — flagship / tool list */}
          <div className="mt-8 grid grid-cols-1 gap-10 md:mt-10 lg:grid-cols-12 lg:gap-6">
            {flagship && (
              <motion.div
                initial={reduced ? false : "hidden"}
                animate="visible"
                variants={fadeUpVariants(0.45)}
                className="lg:col-span-6"
              >
                <FlagshipCell meta={flagship} />
              </motion.div>
            )}

            <motion.div
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={fadeUpVariants(0.55)}
              className="lg:col-span-6"
            >
              <ul className="divide-y divide-border">
                {tools.map((meta) => (
                  <ToolRow key={meta.slug} meta={meta} />
                ))}
                <li className="py-4">
                  <Link
                    to="/cutting-edge-tech"
                    className="flex items-center justify-between gap-4 text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    <span>{t("home.tiles.all")}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Band 3 — receipts baseline */}
          <motion.div
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={fadeUpVariants(0.65)}
            className="mt-10 md:mt-12"
          >
            <div
              aria-hidden
              className="h-px bg-gradient-to-r from-gradient-start to-gradient-end opacity-60"
            />
            <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
              <span className="text-ink-muted">{t("home.proof.label")}</span>
              <span>{t("home.proof.years")}</span>
              <span>{t("home.proof.mediavine")}</span>
              <a
                href="https://sylphie.live"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("home.proof.live")}
              </a>
              <a
                href="https://github.com/Sylphie-Labs"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {t("home.proof.github")}
              </a>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Band 4 — method coda (only below-fold content) */}
      <section className="pb-20 md:pb-28">
        <Container>
          <div className="border-t border-border pt-14 text-center md:pt-16">
            <h2 className="font-display text-2xl italic tracking-tight">
              <span>{t("home.workTitle")}</span>{" "}
              <span>{t("home.thinkTitle")}</span>
            </h2>
            <p className="mt-3 text-sm text-ink-muted md:text-base">
              {t("home.methodLine")}
            </p>
            <Link
              to="/about"
              className="mt-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-accent"
            >
              <span>{t("home.methodCta")}</span>
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function FlagshipCell({ meta }: { meta: CaseMeta }) {
  const { t } = useTranslation();

  return (
    <Link
      to="/cutting-edge-tech/$slug"
      params={{ slug: meta.slug }}
      className="group text-plate relative flex h-full flex-col p-8 transition-colors md:p-10"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
          {t(`work.cases.${meta.slug}.title`)} · {meta.year}
        </span>
        {meta.liveUrl && (
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            <span aria-hidden>● </span>
            {t("home.liveBadge")}
          </span>
        )}
      </div>
      <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-tight lg:text-4xl">
        {t(`work.cases.${meta.slug}.role`)}
      </h2>
      <p className="mt-4 text-sm text-ink-muted md:text-base">
        {t(`work.cases.${meta.slug}.summary`)}
      </p>
      <span
        aria-hidden
        className="mt-auto self-end pt-4 text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
      >
        →
      </span>
    </Link>
  );
}

function ToolRow({ meta }: { meta: CaseMeta }) {
  const { t } = useTranslation();

  const badgeKey = NPM_BADGE_KEYS[meta.slug];
  const title =
    meta.slug === "sylphie-pkg"
      ? t("home.tiles.codebaseTitle")
      : t(`work.cases.${meta.slug}.title`);

  return (
    <li className="group relative py-5 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-xl tracking-tight">
          {/* Stretched link: ::after covers the whole row; the npm badge
              sits above it via z-10 as a separate sibling anchor. */}
          <Link
            to="/cutting-edge-tech/$slug"
            params={{ slug: meta.slug }}
            className="transition-colors after:absolute after:inset-0 group-hover:text-accent"
          >
            {title}
          </Link>
        </h3>
        {badgeKey && meta.npmPackage && (
          <a
            href={`https://www.npmjs.com/package/${meta.npmPackage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-accent"
          >
            {t(`home.proof.${badgeKey}`)}
          </a>
        )}
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-6">
        <p className="text-sm text-ink-muted">{t(`home.tiles.${meta.slug}`)}</p>
        <span
          aria-hidden
          className="text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
        >
          →
        </span>
      </div>
    </li>
  );
}

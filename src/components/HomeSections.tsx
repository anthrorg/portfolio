import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { cases, type CaseMeta } from "@/content/cases";

import { Container } from "./Container";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** "@sylphie-labs/memory-pkg" → "memory-pkg" for the npm badge. */
function npmBasename(pkg: string): string {
  return pkg.split("/").pop() ?? pkg;
}

export function HomeSections() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <>
      <WorkCardsSection reduced={!!reduced} />
      <MethodSection reduced={!!reduced} />
      <OpenSection
        eyebrow={t("home.openEyebrow")}
        title={t("home.openTitle")}
        body={t("home.openBody")}
        cta={t("home.openCta")}
        email={t("home.openEmail")}
        reduced={!!reduced}
      />
    </>
  );
}

type SectionProps = {
  reduced: boolean;
};

function WorkCardsSection({ reduced }: SectionProps) {
  const { t } = useTranslation();

  const flagship = cases.find((meta) => meta.homeCard === "flagship");
  const tools = cases.filter((meta) => meta.homeCard === "tool");

  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.header
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="max-w-3xl"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
            {t("work.title")}
          </p>
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            {t("work.intro")}
          </h2>
        </motion.header>

        {flagship && (
          <FlagshipCard meta={flagship} reduced={reduced} />
        )}

        <div className="mt-8 grid gap-y-8 md:mt-12 md:grid-cols-3 md:gap-x-4">
          {tools.map((meta) => (
            <ToolCard key={meta.slug} meta={meta} reduced={reduced} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6">
          <Link
            to="/cutting-edge-tech"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            <span>{t("home.casesCta")}</span>
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/cutting-edge-tech/$slug"
            params={{ slug: "procedural-knowledge-graphs" }}
            className="inline-flex items-center gap-3 text-base text-ink-muted transition-colors hover:text-accent"
          >
            <span>{t("home.essay")}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

type CardProps = {
  meta: CaseMeta;
  reduced: boolean;
};

function FlagshipCard({ meta, reduced }: CardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className="mt-10 md:mt-14"
    >
      <Link
        to="/cutting-edge-tech/$slug"
        params={{ slug: meta.slug }}
        className="group text-plate relative block p-10 transition-colors md:p-14"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4">
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
        <h3 className="mt-6 font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
          {t(`work.cases.${meta.slug}.role`)}
        </h3>
        <p className="mt-4 max-w-2xl text-sm text-ink-muted md:text-base">
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

function ToolCard({ meta, reduced }: CardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <Link
        to="/cutting-edge-tech/$slug"
        params={{ slug: meta.slug }}
        className="group text-plate relative block h-full p-8 transition-colors md:p-10"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t(`work.cases.${meta.slug}.title`)} · {meta.year}
          </span>
          {meta.npmPackage && (
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              npm — {npmBasename(meta.npmPackage)}
            </span>
          )}
        </div>
        <h3 className="mt-6 font-display text-2xl leading-[1.1] tracking-tight md:text-3xl">
          {t(`work.cases.${meta.slug}.role`)}
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

function MethodSection({ reduced }: SectionProps) {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="text-plate max-w-4xl p-8 md:p-12"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
            {t("home.methodEyebrow")}
          </p>
          <h2 className="max-w-3xl font-display text-3xl leading-[1.15] tracking-tight md:text-4xl">
            <span className="block">{t("home.workTitle")}</span>
            <span className="block">{t("home.thinkTitle")}</span>
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {t("home.methodBody")}
          </p>
          <Link
            to="/about"
            className="group mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-widest text-ink-muted transition-colors hover:text-accent"
          >
            <span>{t("home.methodCta")}</span>
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

type OpenSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  email: string;
  reduced: boolean;
};

function OpenSection({
  eyebrow,
  title,
  body,
  cta,
  email,
  reduced,
}: OpenSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="text-plate max-w-4xl p-8 md:p-12"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
            {eyebrow}
          </p>
          <h2 className="max-w-3xl font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {body}
          </p>
          <a
            href={`mailto:${email}`}
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            <span>{cta}</span>
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";

import { cases, type CaseMeta } from "@/content/cases";

import { Container } from "./Container";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const NPM_CODEBASE_PKG_URL =
  "https://www.npmjs.com/package/@sylphie-labs/codebase-pkg";

const PROOF_LINKS = [
  { key: "live", href: "https://sylphie.live" },
  { key: "npmMemory", href: "https://www.npmjs.com/package/@sylphie-labs/memory-pkg" },
  { key: "npmCodebase", href: NPM_CODEBASE_PKG_URL },
  { key: "github", href: "https://github.com/Sylphie-Labs" },
] as const;

export function HomeSections() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <>
      <WorkCardsSection reduced={!!reduced} />
      <ProseSection
        eyebrow={t("home.workEyebrow")}
        title={t("home.workTitle")}
        body={
          <Trans
            i18nKey="home.workBody"
            components={{
              mcpLink: (
                <a
                  href={NPM_CODEBASE_PKG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-border decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                />
              ),
            }}
          />
        }
        reduced={!!reduced}
      />
      <ProseSection
        eyebrow={t("home.thinkEyebrow")}
        title={t("home.thinkTitle")}
        body={t("home.thinkBody")}
        reduced={!!reduced}
      />
      <OpenSection
        eyebrow={t("home.openEyebrow")}
        title={t("home.openTitle")}
        body={t("home.openBody")}
        cta={t("home.openCta")}
        email={t("home.openEmail")}
        reduced={!!reduced}
      />
      <ProofStrip reduced={!!reduced} />
    </>
  );
}

type WorkCardsSectionProps = {
  reduced: boolean;
};

function WorkCardsSection({ reduced }: WorkCardsSectionProps) {
  const { t } = useTranslation();

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

        <div className="mt-10 grid gap-y-8 md:mt-14 md:grid-cols-2 md:gap-y-12">
          {cases.map((meta) => (
            <HomeCaseCard key={meta.slug} meta={meta} reduced={reduced} />
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/cutting-edge-tech"
            className="group inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            <span>{t("home.casesCta")}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

type HomeCaseCardProps = {
  meta: CaseMeta;
  reduced: boolean;
};

function HomeCaseCard({ meta, reduced }: HomeCaseCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className="md:px-2"
    >
      <Link
        to="/cutting-edge-tech/$slug"
        params={{ slug: meta.slug }}
        className="group text-plate relative block h-full p-8 transition-colors md:p-10"
      >
        {/* Same typography flip as the Cutting Edge Tech index: the role is
            the display heading so a skimmer sorts cases by type of work; the
            project name sits in the mono eyebrow with the year. */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t(`work.cases.${meta.slug}.title`)}
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {meta.year}
          </span>
        </div>
        <h3 className="mt-6 font-display text-3xl leading-[1.1] tracking-tight md:text-5xl">
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

type ProseSectionProps = {
  eyebrow: string;
  title: string;
  body: ReactNode;
  reduced: boolean;
};

function ProseSection({ eyebrow, title, body, reduced }: ProseSectionProps) {
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

type ProofStripProps = {
  reduced: boolean;
};

function ProofStrip({ reduced }: ProofStripProps) {
  const { t } = useTranslation();

  return (
    <section className="py-10 md:py-12">
      <Container>
        <motion.nav
          aria-label={t("home.proof.label")}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-border pt-8"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            {t("home.proof.label")}
          </span>
          {PROOF_LINKS.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-accent"
            >
              {t(`home.proof.${key}`)}
            </a>
          ))}
          <Link
            to="/cutting-edge-tech"
            className="font-mono text-xs uppercase tracking-widest transition-colors hover:text-accent"
          >
            {t("home.proof.cases")}
          </Link>
        </motion.nav>
      </Container>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import {
  career,
  pickLocalized,
  type CareerEntry,
} from "@/content/career";
import { useHead } from "@/lib/use-head";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const RESUME_HREF = "/jim-tisdale-resume.pdf";

const SECTIONS = [
  { key: "roles", entries: career.roles },
  { key: "education", entries: career.education },
  { key: "certifications", entries: career.certifications },
  { key: "languages", entries: career.languages },
] as const;

function Career() {
  const { t, i18n } = useTranslation();
  useHead({
    title: t("career.title"),
    description: t("meta.career"),
    path: "/career",
  });
  const reduced = useReducedMotion();
  const lang = i18n.resolvedLanguage ?? "en";
  const visibleSections = SECTIONS.filter((s) => s.entries.length > 0);

  return (
    <Container className="py-24 md:py-32">
      <motion.header
        className="max-w-3xl"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("career.title")}
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {t("career.intro")}
        </h1>

        <a
          href={RESUME_HREF}
          download
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-2 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
        >
          <span>{t("career.downloadResume")}</span>
          <span aria-hidden>↓</span>
        </a>
      </motion.header>

      <div className="mt-20 space-y-16 md:space-y-20">
        {visibleSections.map((section, i) => (
          <CareerSection
            key={section.key}
            heading={t(`career.sections.${section.key}`)}
            entries={section.entries}
            lang={lang}
            reduced={!!reduced}
            delay={reduced ? 0 : 0.2 + 0.1 * i}
          />
        ))}
      </div>
    </Container>
  );
}

type CareerSectionProps = {
  heading: string;
  entries: readonly CareerEntry[];
  lang: string;
  reduced: boolean;
  delay: number;
};

function CareerSection({
  heading,
  entries,
  lang,
  reduced,
  delay,
}: CareerSectionProps) {
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      className="border-t border-border pt-10"
    >
      <h2 className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
        {heading}
      </h2>
      <ul className="mt-6 divide-y divide-border border-y border-border bg-bg">
        {entries.map((entry, i) => (
          <CareerRow key={i} entry={entry} lang={lang} />
        ))}
      </ul>
    </motion.section>
  );
}

function CareerRow({ entry, lang }: { entry: CareerEntry; lang: string }) {
  const detail = pickLocalized(entry.detail, lang);
  return (
    <li className="grid gap-2 py-6 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8">
      <div>
        <p className="font-display text-xl tracking-tight md:text-2xl">
          {pickLocalized(entry.primary, lang)}
        </p>
        <p className="mt-1 text-sm text-ink-muted md:text-base">
          {pickLocalized(entry.secondary, lang)}
        </p>
        {detail && (
          <p className="mt-3 max-w-2xl text-sm text-ink-muted">{detail}</p>
        )}
      </div>
      {entry.dates && (
        <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {entry.dates}
        </p>
      )}
    </li>
  );
}

export const Route = createFileRoute("/career")({
  component: Career,
});

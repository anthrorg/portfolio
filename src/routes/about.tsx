import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { useHead } from "@/lib/use-head";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * Section keys for the four About subsections rendered below the lede.
 * Order is load-bearing: trajectory → frontier → next → curiosity. Each
 * does one job (where Jim came from, what he ships on his own time, what
 * role he's pointing at, one human beat). Adding a section means adding
 * a matching `about.<key>.{eyebrow,title,body}` triple in i18n.
 */
const SECTION_KEYS = ["trajectory", "frontier", "next", "curiosity"] as const;

function About() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  useHead({
    title: t("nav.about"),
    description: t("meta.about"),
    path: "/about",
  });

  return (
    <Container className="py-24 md:py-32">
      <motion.header
        className="text-plate max-w-3xl"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("about.eyebrow")}
        </p>
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          {t("about.title")}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-muted md:text-xl">
          {t("about.body1")}
        </p>
      </motion.header>

      <div className="mt-20 space-y-16 md:space-y-24">
        {SECTION_KEYS.map((key, i) => (
          <AboutSection
            key={key}
            sectionKey={key}
            reduced={!!reduced}
            delay={reduced ? 0 : 0.15 + 0.1 * i}
          />
        ))}
      </div>
    </Container>
  );
}

type AboutSectionProps = {
  sectionKey: (typeof SECTION_KEYS)[number];
  reduced: boolean;
  delay: number;
};

function AboutSection({ sectionKey, reduced, delay }: AboutSectionProps) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      className="text-plate max-w-3xl border-t border-border pt-12"
      aria-labelledby={`about-${sectionKey}-heading`}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
        {t(`about.${sectionKey}.eyebrow`)}
      </p>
      <h2
        id={`about-${sectionKey}-heading`}
        className="mt-6 font-display text-3xl leading-[1.1] tracking-tight md:text-5xl"
      >
        {t(`about.${sectionKey}.title`)}
      </h2>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
        {t(`about.${sectionKey}.body`)}
      </p>
    </motion.section>
  );
}

export const Route = createFileRoute("/about")({
  component: About,
});

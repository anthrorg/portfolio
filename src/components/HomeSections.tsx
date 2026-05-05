import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "./Container";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function HomeSections() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <>
      <ProseSection
        eyebrow={t("home.workEyebrow")}
        title={t("home.workTitle")}
        body={t("home.workBody")}
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
    </>
  );
}

type ProseSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  reduced: boolean;
};

function ProseSection({ eyebrow, title, body, reduced }: ProseSectionProps) {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
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
    <section className="border-t border-border py-24 md:py-32">
      <Container>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
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

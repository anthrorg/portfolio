import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";

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

export function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <section className="pt-24 pb-20 md:pt-40 md:pb-32">
      <Container>
        <div className="max-w-3xl">
          <motion.p
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={eyebrowVariants}
            className="mb-8 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm"
          >
            {t("hero.eyebrow")}
          </motion.p>

          <h1 className="font-display font-light leading-[1.05] tracking-tight text-[clamp(2rem,6vw,4.5rem)]">
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
            variants={fadeUpVariants(0.3)}
            className="mt-8 text-lg text-ink-muted md:text-xl"
          >
            {t("hero.subhead")}
          </motion.p>

          <motion.div
            initial={reduced ? false : "hidden"}
            animate="visible"
            variants={fadeUpVariants(0.5)}
            className="mt-10"
          >
            <Link
              to="/work"
              className="group inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
            >
              <span>{t("hero.cta")}</span>
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

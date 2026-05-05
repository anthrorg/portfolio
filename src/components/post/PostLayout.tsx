import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MDXProvider } from "@mdx-js/react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { mdxComponents } from "@/components/case-study/mdx-components";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export type PostLang = "en" | "ja";

export type PostMeta = {
  title: string;
  date: string;
  summary: string;
  tags?: readonly string[];
  lang?: PostLang;
  readingTimeMinutes?: number;
};

type PostLayoutProps = {
  meta: PostMeta;
  children: ReactNode;
};

export function PostLayout({ meta, children }: PostLayoutProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const lang = meta.lang ?? "en";

  const formattedDate = formatDate(meta.date, lang);

  return (
    <Container className="py-16 md:py-24">
      <Link
        to="/writing"
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted transition-colors hover:text-accent"
      >
        <span aria-hidden>←</span>
        <span>{t("writing.backToWriting")}</span>
      </Link>

      <motion.header
        className="mt-12 border-b border-border pb-12 md:pb-20"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-ink-muted">
          <time dateTime={meta.date}>{formattedDate}</time>
          {meta.readingTimeMinutes != null && (
            <span>{t("writing.readingTime", { count: meta.readingTimeMinutes })}</span>
          )}
          <span aria-label={t("writing.languageLabel")}>{lang.toUpperCase()}</span>
        </div>

        <h1
          lang={lang}
          className="mt-10 font-display tracking-tight leading-[1.05] text-[clamp(2rem,6vw,4.5rem)]"
        >
          {meta.title}
        </h1>

        <p
          lang={lang}
          className="mt-8 max-w-2xl text-lg text-ink-muted md:text-xl"
        >
          {meta.summary}
        </p>

        {meta.tags && meta.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {meta.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest text-ink-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </motion.header>

      <article lang={lang} className="mt-12 md:mt-16">
        <MDXProvider components={mdxComponents}>{children}</MDXProvider>
      </article>
    </Container>
  );
}

function formatDate(iso: string, lang: PostLang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

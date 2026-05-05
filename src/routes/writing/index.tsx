import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { posts, type PostEntry } from "@/content/posts";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useViewTransitionEnabled } from "@/lib/use-view-transition";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(uiLang: string): Intl.DateTimeFormat {
  const locale = uiLang === "ja" ? "ja-JP" : "en-US";
  let formatter = dateFormatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    dateFormatters.set(locale, formatter);
  }
  return formatter;
}

function WritingIndex() {
  const { t, i18n } = useTranslation();
  useDocumentTitle(t("writing.title"));
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
          {t("writing.title")}
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {t("writing.intro")}
        </h1>
      </motion.header>

      {posts.length === 0 ? (
        <p className="mt-16 max-w-prose text-base text-ink-muted">
          {t("writing.empty")}
        </p>
      ) : (
        <ul className="mt-16 divide-y divide-border border-y border-border bg-bg">
          {posts.map((post, i) => (
            <PostRow
              key={post.slug}
              post={post}
              index={i}
              reduced={!!reduced}
              viewTransition={viewTransition}
              uiLang={i18n.resolvedLanguage ?? "en"}
            />
          ))}
        </ul>
      )}
    </Container>
  );
}

type PostRowProps = {
  post: PostEntry;
  index: number;
  reduced: boolean;
  viewTransition: boolean;
  uiLang: string;
};

function PostRow({
  post,
  index,
  reduced,
  viewTransition,
  uiLang,
}: PostRowProps) {
  const d = new Date(post.meta.date);
  const formattedDate = Number.isNaN(d.getTime())
    ? post.meta.date
    : getDateFormatter(uiLang).format(d);
  const postLang = post.meta.lang ?? "en";

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: reduced ? 0 : 0.2 + 0.05 * index,
        ease: EASE_OUT,
      }}
    >
      <Link
        to="/writing/$slug"
        params={{ slug: post.slug }}
        viewTransition={viewTransition}
        className="group block py-8 transition-colors hover:text-accent"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-widest text-ink-muted">
          <time dateTime={post.meta.date}>{formattedDate}</time>
          <span aria-hidden>—</span>
          <span>{postLang.toUpperCase()}</span>
        </div>
        <h2
          lang={postLang}
          className="mt-3 font-display text-2xl tracking-tight md:text-4xl"
        >
          {post.meta.title}
        </h2>
        <p
          lang={postLang}
          className="mt-3 max-w-2xl text-sm text-ink-muted md:text-base"
        >
          {post.meta.summary}
        </p>
      </Link>
    </motion.li>
  );
}

export const Route = createFileRoute("/writing/")({
  component: WritingIndex,
});

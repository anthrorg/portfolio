import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { useDocumentTitle } from "@/lib/use-document-title";

function About() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.about"));
  return (
    <Container className="py-24 md:py-32">
      <header className="max-w-3xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("about.eyebrow")}
        </p>
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          {t("about.title")}
        </h1>
        <div className="mt-8 max-w-2xl space-y-6 text-lg text-ink-muted md:text-xl">
          <p>{t("about.body1")}</p>
          <p>{t("about.body2")}</p>
        </div>
      </header>
    </Container>
  );
}

export const Route = createFileRoute("/about")({
  component: About,
});

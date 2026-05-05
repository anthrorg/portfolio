import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { useDocumentTitle } from "@/lib/use-document-title";

const EMAIL = "jctisdale1988@gmail.com";

function Contact() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.contact"));
  return (
    <Container className="py-24 md:py-32">
      <header className="max-w-3xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
          {t("contact.eyebrow")}
        </p>
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          {t("contact.title")}
        </h1>
        <p className="mt-8 max-w-2xl text-lg text-ink-muted md:text-xl">
          {t("contact.lede")}
        </p>
      </header>

      <ul className="mt-16 max-w-2xl divide-y divide-border border-y border-border bg-bg">
        <li className="grid gap-2 py-6 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-8">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-muted md:text-sm">
            {t("contact.emailLabel")}
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-xl tracking-tight underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent md:text-2xl"
          >
            {EMAIL}
          </a>
        </li>
      </ul>
    </Container>
  );
}

export const Route = createFileRoute("/contact")({
  component: Contact,
});

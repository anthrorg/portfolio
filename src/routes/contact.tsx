import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Container } from "@/components/Container";
import { useHead } from "@/lib/use-head";

const EMAIL = "jctisdale1988@gmail.com";

function Contact() {
  const { t } = useTranslation();
  useHead({
    title: t("nav.contact"),
    description: t("meta.contact"),
    path: "/contact",
  });
  return (
    <Container className="py-24 md:py-32">
      <header className="text-plate max-w-3xl p-8 md:p-12">
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

      <ul className="text-plate mt-16 max-w-2xl divide-y divide-border p-2 md:p-4">
        <li className="grid gap-2 px-6 py-6 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-8">
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

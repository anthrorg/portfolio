import { useTranslation } from "react-i18next";

import { Container } from "./Container";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      className="mt-24 bg-bg/70 backdrop-blur-md"
    >
      {/* Gradient hairline standing in for the old border-t — same 1px of
          flow height, so footer layout is unchanged. */}
      <div
        aria-hidden
        className="h-px bg-gradient-to-r from-gradient-start to-gradient-end opacity-40"
      />
      <Container className="flex flex-col gap-6 py-10 text-xs text-ink-muted">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest">
          <li>
            <a
              href="mailto:jctisdale1988@gmail.com"
              className="transition-colors hover:text-accent"
            >
              {t("footer.email")}
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Sylphie-Labs"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {t("footer.github")}
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/jim-tisdale"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {t("footer.linkedin")}
            </a>
          </li>
        </ul>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} Jim Tisdale. {t("footer.rights")}
          </span>
          <span className="font-mono">author.sylphie.live</span>
        </div>
      </Container>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

export function Nav() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/70 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight">
          Jim Tisdale
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <Link
                to="/cutting-edge-tech"
                className="transition-colors hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {t("nav.work")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="transition-colors hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link
                to="/career"
                className="transition-colors hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {t("nav.career")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="transition-colors hover:text-accent"
                activeProps={{ className: "text-accent" }}
              >
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

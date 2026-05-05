import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LanguageToggle } from "./LanguageToggle";

const NAV_ITEMS = [
  { to: "/work" as const, key: "nav.work" },
  { to: "/about" as const, key: "nav.about" },
  { to: "/writing" as const, key: "nav.writing" },
  { to: "/career" as const, key: "nav.career" },
  { to: "/contact" as const, key: "nav.contact" },
];

export function MobileNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("nav.openMenu")}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg transition-colors hover:border-accent hover:text-accent"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <line x1="4" y1="8" x2="20" y2="8" />
            <line x1="4" y1="16" x2="20" y2="16" />
          </svg>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80 backdrop-blur-md" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-bg">
          <Dialog.Title className="sr-only">{t("nav.openMenu")}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t("nav.menuDescription")}
          </Dialog.Description>
          <div className="flex h-14 items-center justify-between border-b border-border px-6">
            <span className="font-display text-lg tracking-tight">
              Jim Tisdale
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("nav.closeMenu")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg transition-colors hover:border-accent hover:text-accent"
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </Dialog.Close>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex flex-1 flex-col justify-between px-6 py-12"
          >
            <ul className="flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl tracking-tight transition-colors hover:text-accent"
                    activeProps={{ className: "text-accent" }}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-end gap-3">
              <LanguageToggle />
            </div>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

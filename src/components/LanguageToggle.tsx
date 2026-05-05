import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const next = i18n.resolvedLanguage === "ja" ? "en" : "ja";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      className="rounded-full border border-border bg-bg px-3 py-1 text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
      aria-label={`Switch language to ${next}`}
    >
      {t("language.toggle")}
    </button>
  );
}

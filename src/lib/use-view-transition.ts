import { useTranslation } from "react-i18next";

export function useViewTransitionEnabled(): boolean {
  const { i18n } = useTranslation();
  return i18n.resolvedLanguage === "en";
}

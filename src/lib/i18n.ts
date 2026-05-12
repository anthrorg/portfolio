import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enCommon from "@/locales/en/common.json";
import jaCommon from "@/locales/ja/common.json";

export const SUPPORTED_LANGUAGES = ["en", "ja"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ja: { common: jaCommon },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "lang",
    },
  });

i18next.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18next.language || "en";
}

export const i18n = i18next;

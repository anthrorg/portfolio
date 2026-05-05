export type Localized = { en: string; ja: string };

export type CareerEntry = {
  primary: Localized;
  secondary: Localized;
  dates: string;
  detail: Localized;
};

export type CareerData = {
  roles: readonly CareerEntry[];
  education: readonly CareerEntry[];
  certifications: readonly CareerEntry[];
  languages: readonly CareerEntry[];
};

export const career: CareerData = {
  roles: [
    {
      primary: {
        en: "Mediavine, Software Engineer III",
        ja: "Mediavine, Software Engineer III",
      },
      secondary: {
        en: "Senior full-stack on the ad-tech platform serving thousands of publishers.",
        ja: "Senior full-stack on the ad-tech platform serving thousands of publishers.",
      },
      dates: "Nov 2021 – Mar 2025",
      detail: {
        en: "Built Mediavine Journey end-to-end with a small team (onboarding, analytics engine, publisher dashboards). Primary developer on the analytics & data-visualization dashboard. Led internal AI tooling adoption company-wide. Stack: React, TypeScript, Node.js, Nest.js, PostgreSQL, REST + GraphQL.",
        ja: "Built Mediavine Journey end-to-end with a small team (onboarding, analytics engine, publisher dashboards). Primary developer on the analytics & data-visualization dashboard. Led internal AI tooling adoption company-wide. Stack: React, TypeScript, Node.js, Nest.js, PostgreSQL, REST + GraphQL.",
      },
    },
    {
      primary: {
        en: "Tek Systems, React Developer",
        ja: "Tek Systems, React Developer",
      },
      secondary: {
        en: "Charlotte, NC.",
        ja: "Charlotte, NC.",
      },
      dates: "Jul 2020 – Nov 2021",
      detail: {
        en: "React + GraphQL/Apollo. UX/UI collaboration, code review, feature work across client engagements.",
        ja: "React + GraphQL/Apollo. UX/UI collaboration, code review, feature work across client engagements.",
      },
    },
    {
      primary: {
        en: "Legal Associations Management, Web Developer / Team Lead",
        ja: "Legal Associations Management, Web Developer / Team Lead",
      },
      secondary: {
        en: "Dothan, AL. Membership, event, and legal-platform tech for 10,000+ users.",
        ja: "Dothan, AL. Membership, event, and legal-platform tech for 10,000+ users.",
      },
      dates: "Jan 2019 – Jun 2020",
      detail: {
        en: "Promoted to Team Lead in nine months. Built a Node.js membership system that drove $50K annual ad revenue and $22.5K savings.",
        ja: "Promoted to Team Lead in nine months. Built a Node.js membership system that drove $50K annual ad revenue and $22.5K savings.",
      },
    },
  ],
  education: [
    {
      primary: {
        en: "Thinkful, Coding Bootcamp",
        ja: "Thinkful, Coding Bootcamp",
      },
      secondary: {
        en: "Full-stack web development.",
        ja: "Full-stack web development.",
      },
      dates: "Feb – Sep 2018",
      detail: { en: "", ja: "" },
    },
  ],
  certifications: [],
  languages: [
    {
      primary: { en: "English", ja: "英語" },
      secondary: { en: "Native", ja: "ネイティブ" },
      dates: "",
      detail: { en: "", ja: "" },
    },
    {
      primary: { en: "Japanese", ja: "日本語" },
      secondary: { en: "Studying, JLPT material", ja: "学習中、JLPT教材" },
      dates: "",
      detail: { en: "", ja: "" },
    },
  ],
};

export function pickLocalized(value: Localized, lang: string): string {
  return lang === "ja" ? value.ja : value.en;
}

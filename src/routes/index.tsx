import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { useHead } from "@/lib/use-head";

function HomePage() {
  const { t } = useTranslation();
  useHead({ description: t("meta.home"), path: "/" });
  return (
    <>
      <Hero />
      <HomeSections />
    </>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

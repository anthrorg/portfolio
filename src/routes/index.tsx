import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { HomeBento } from "@/components/HomeBento";
import { useHead } from "@/lib/use-head";

function HomePage() {
  const { t } = useTranslation();
  useHead({ description: t("meta.home"), path: "/" });
  return <HomeBento />;
}

export const Route = createFileRoute("/")({
  component: HomePage,
});

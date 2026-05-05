import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { useDocumentTitle } from "@/lib/use-document-title";

function HomePage() {
  useDocumentTitle();
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

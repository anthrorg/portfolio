import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useTranslation } from "react-i18next";

import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useThemeFollowsOS } from "@/lib/use-theme";

function RootLayout() {
  useThemeFollowsOS();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        {t("nav.skipToContent")}
      </a>
      <Nav />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
});

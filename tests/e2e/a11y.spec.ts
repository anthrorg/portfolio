import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "homepage" },
  { path: "/work", label: "work index" },
  { path: "/work/sylphie", label: "case study (Sylphie)" },
  { path: "/work/mediavine", label: "case study fallback (Mediavine)" },
  { path: "/writing", label: "writing index" },
  { path: "/about", label: "about" },
  { path: "/career", label: "career" },
  { path: "/contact", label: "contact" },
];

for (const { path, label } of ROUTES) {
  test(`${label} has no axe-core violations`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    // Devtools render an extra <footer> in dev; users never see it.
    await page.evaluate(() => {
      document.querySelector(".TanStackRouterDevtools")?.remove();
    });
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

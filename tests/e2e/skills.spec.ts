import { expect, test } from "@playwright/test";

test.describe("Skills constellation (career page)", () => {
  test("renders skill labels and project glyphs; hover updates aria-live strip", async ({
    page,
  }) => {
    await page.goto("/career");

    await expect(
      page.getByRole("heading", { level: 2, name: /What I reach for/i }),
    ).toBeVisible();

    const skillsSection = page.getByRole("region", {
      name: /What I reach for/i,
    });
    const constellation = skillsSection.locator("svg");
    await expect(constellation).toBeVisible();

    // A representative skill from each cluster should appear at least once
    // in the SVG. (TypeScript appears in two clusters → use `.first()`.)
    await expect(constellation.getByText("TypeScript").first()).toBeVisible();
    await expect(constellation.getByText("React")).toBeVisible();
    await expect(constellation.getByText("Railway")).toBeVisible();
    await expect(constellation.getByText("Playwright")).toBeVisible();

    // Idle state of the aria-live strip should match the i18n select-prompt.
    const liveRegion = page.locator("[aria-live='polite']");
    await expect(liveRegion).toContainText(/Hover or focus a skill/i);

    // Focusing the Sylphie project node should reveal a "Project · Sylphie"
    // crossref and an "Open case study" link in the strip. Using focus()
    // instead of hover() because the constellation has an idle drift
    // animation that prevents pixel-stable hover targets.
    await skillsSection
      .getByRole("button", { name: "Sylphie", exact: true })
      .focus();
    await expect(liveRegion).toContainText(/Sylphie/);
    await expect(
      liveRegion.getByRole("link", { name: /open case study/i }),
    ).toBeVisible();
  });
});

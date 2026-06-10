import { expect, test } from "@playwright/test";

test.describe("SEO meta", () => {
  test("homepage has the site title and a meaningful description", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Jim Tisdale — Agent Engineer");
    const desc = await page
      .locator('head > meta[name="description"]')
      .getAttribute("content");
    expect(desc).toContain("AI systems");
  });

  test("OpenGraph + Twitter image points to the OG asset", async ({ page }) => {
    await page.goto("/");
    const og = await page
      .locator('head > meta[property="og:image"]')
      .getAttribute("content");
    const tw = await page
      .locator('head > meta[name="twitter:image"]')
      .getAttribute("content");
    expect(og).toContain("og-default.png");
    expect(tw).toContain("og-default.png");
  });

  test("OG image is reachable", async ({ request }) => {
    const r = await request.get("/og-default.png");
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toContain("image/png");
  });

  test("each route updates the document title", async ({ page }) => {
    await page.goto("/cutting-edge-tech");
    await expect(page).toHaveTitle("Cutting Edge Tech — Jim Tisdale");

    await page.goto("/career");
    await expect(page).toHaveTitle("Career — Jim Tisdale");

    await page.goto("/cutting-edge-tech/sylphie");
    await expect(page).toHaveTitle("Sylphie — Jim Tisdale");
  });
});

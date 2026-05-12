import { expect, test } from "@playwright/test";

test("homepage renders the hero tagline", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1 }),
  ).toContainText("ship production software");
});

import { expect, test } from "@playwright/test";

test.describe("Work index", () => {
  test("renders heading and the Sylphie case featured", async ({ page }) => {
    await page.goto("/work");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sylphie" })).toBeVisible();
    await expect(page.getByText("Featured")).toBeVisible();
  });

  test("clicking the featured case navigates to /work/sylphie", async ({
    page,
  }) => {
    await page.goto("/work");
    await page
      .getByRole("link", { name: /Sylphie/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/work\/sylphie/);
  });
});

test.describe("Sylphie case study", () => {
  test("renders MDX body and prev/next nav", async ({ page }) => {
    await page.goto("/work/sylphie");

    await expect(
      page.getByRole("heading", { level: 1, name: "Sylphie" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: /thesis/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /drive engine/i }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: /back to work/i })).toBeVisible();
  });

  test("navigates back to /work via the back link", async ({ page }) => {
    await page.goto("/work/sylphie");
    await page.getByRole("link", { name: /back to work/i }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
  });
});

test.describe("Mobile drawer nav", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger opens drawer and a link navigates + closes drawer", async ({
    page,
  }) => {
    await page.goto("/");

    const hamburger = page.getByRole("button", { name: /open menu/i });
    await expect(hamburger).toBeVisible();

    await hamburger.click();

    const drawerWorkLink = page
      .getByRole("dialog")
      .getByRole("link", { name: /^Frontier$/ });
    await expect(drawerWorkLink).toBeVisible();

    await drawerWorkLink.click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

test.describe("Language toggle", () => {
  test("switches to Japanese and persists across navigation", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /switch language to ja/i }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    const navWorkLink = page.getByRole("link", { name: "Frontier", exact: true });
    await expect(navWorkLink).toBeVisible();

    await navWorkLink.click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });
});

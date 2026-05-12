import { expect, test } from "@playwright/test";

test.describe("Work index", () => {
  test("renders heading and a featured case from the pool", async ({
    page,
  }) => {
    await page.goto("/work");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Exactly one card carries the "Featured" eyebrow per render (the
    // randomly chosen one from the featured pool). The other two cases sit
    // in the supporting grid; all three case titles must appear somewhere
    // on the page regardless of which one is featured this paint.
    await expect(page.getByText("Featured")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sylphie" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "memory-pkg" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "sylphie-pkg" }),
    ).toBeVisible();
  });

  test("clicking the Sylphie card navigates to /work/sylphie", async ({
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

test.describe("memory-pkg case study", () => {
  test("renders the H1 title from i18n and a body heading", async ({
    page,
  }) => {
    await page.goto("/work/memory-pkg");

    await expect(
      page.getByRole("heading", { level: 1, name: "memory-pkg" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /the problem/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /back to work/i }),
    ).toBeVisible();
  });
});

test.describe("sylphie-pkg case study", () => {
  test("renders the H1 title from i18n and a body heading", async ({
    page,
  }) => {
    await page.goto("/work/sylphie-pkg");

    await expect(
      page.getByRole("heading", { level: 1, name: "sylphie-pkg" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /the problem/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /back to work/i }),
    ).toBeVisible();
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
  test.skip("switches to Japanese and persists across navigation", async ({
    page,
  }) => {
    // Disabled while the JA copy is being audited. Re-enable once the
    // LanguageToggle is back in the nav.
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

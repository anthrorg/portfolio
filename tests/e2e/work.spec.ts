import { expect, test } from "@playwright/test";

test.describe("Work index", () => {
  test("renders heading and a featured case from the pool", async ({
    page,
  }) => {
    await page.goto("/work");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Exactly one card carries the "Featured" eyebrow per render (the
    // randomly chosen one from the featured pool). The other three cases
    // sit in the supporting grid; all four case titles must appear
    // somewhere on the page regardless of which one is featured this
    // paint.
    await expect(page.getByText("Featured")).toBeVisible();
    // exact: true so "Sylphie" doesn't substring-match the link/heading
    // for "sylphie-pkg" when that one wins the featured rotation.
    await expect(
      page.getByRole("heading", { name: "Sylphie", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "memory-pkg", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "sylphie-pkg", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Enforcement Hooks", exact: true }),
    ).toBeVisible();
  });

  test("clicking the Sylphie card navigates to /work/sylphie", async ({
    page,
  }) => {
    await page.goto("/work");
    // exact: true so we don't accidentally click the sylphie-pkg card
    // when it shares the substring "Sylphie".
    await page
      .getByRole("heading", { name: "Sylphie", exact: true })
      .click();
    await expect(page).toHaveURL(/\/work\/sylphie\/?$/);
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

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/work/memory-pkg");

    const related = page.getByRole("region", { name: /more on the frontier/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/work/sylphie"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/sylphie-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/enforcement-hooks"]'),
    ).toBeVisible();
  });

  test("Article TOC nav lists at least three anchors", async ({ page }) => {
    await page.goto("/work/memory-pkg");

    // CaseTOC is mounted-only — wait for it to populate after hydration.
    const toc = page
      .getByRole("navigation", { name: /article contents/i })
      .first();
    await expect(toc).toBeVisible();
    const anchors = toc.locator('a[href^="#"]');
    expect(await anchors.count()).toBeGreaterThanOrEqual(3);
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

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/work/sylphie-pkg");

    const related = page.getByRole("region", { name: /more on the frontier/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/work/sylphie"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/memory-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/enforcement-hooks"]'),
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

  test("renders the appended Why it matters + Code map sections", async ({
    page,
  }) => {
    await page.goto("/work/sylphie");

    await expect(
      page.getByRole("heading", { level: 2, name: /why it matters/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /code map/i }),
    ).toBeVisible();
  });

  test("Article TOC nav covers the appended sections", async ({ page }) => {
    await page.goto("/work/sylphie");

    // CaseTOC mounts after Suspense resolves the lazy MDX; wait for it
    // to populate via the MutationObserver scan.
    const toc = page
      .getByRole("navigation", { name: /article contents/i })
      .first();
    await expect(toc).toBeVisible();

    // The new H2s should slug to #why-it-matters and #code-map via
    // rehype-slug. Asserting on the anchor hrefs (rather than visible
    // text) keeps the check stable even if the rail wraps text.
    await expect(toc.locator('a[href="#why-it-matters"]')).toBeVisible();
    await expect(toc.locator('a[href="#code-map"]')).toBeVisible();
  });

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/work/sylphie");

    const related = page.getByRole("region", { name: /more on the frontier/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/work/memory-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/sylphie-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/enforcement-hooks"]'),
    ).toBeVisible();
  });

  test("navigates back to /work via the back link", async ({ page }) => {
    await page.goto("/work/sylphie");
    await page.getByRole("link", { name: /back to work/i }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
  });
});

test.describe("Enforcement Hooks case study", () => {
  test("renders the H1 title from i18n and a body heading", async ({
    page,
  }) => {
    await page.goto("/work/enforcement-hooks");

    await expect(
      page.getByRole("heading", { level: 1, name: "Enforcement Hooks" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /the problem/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /back to work/i }),
    ).toBeVisible();
  });

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/work/enforcement-hooks");

    const related = page.getByRole("region", { name: /more on the frontier/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/work/sylphie"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/memory-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/work/sylphie-pkg"]'),
    ).toBeVisible();
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

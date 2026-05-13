import { expect, test } from "@playwright/test";

test.describe("Cutting Edge Tech index", () => {
  test("renders heading and a featured case from the pool", async ({
    page,
  }) => {
    await page.goto("/cutting-edge-tech");

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

  test("renders the refreshed H1 copy", async ({ page }) => {
    await page.goto("/cutting-edge-tech");
    // The H1 should reflect the new tagline; check on a substring rather
    // than the full string so a future copy tweak that preserves the
    // "oriented" anchor doesn't break this assertion.
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /stay oriented/i,
    );
  });

  test("clicking the Sylphie card navigates to /cutting-edge-tech/sylphie", async ({
    page,
  }) => {
    await page.goto("/cutting-edge-tech");
    // exact: true so we don't accidentally click the sylphie-pkg card
    // when it shares the substring "Sylphie".
    await page
      .getByRole("heading", { name: "Sylphie", exact: true })
      .click();
    await expect(page).toHaveURL(/\/cutting-edge-tech\/sylphie\/?$/);
  });
});

test.describe("memory-pkg case study", () => {
  test("renders the H1 title from i18n and a body heading", async ({
    page,
  }) => {
    await page.goto("/cutting-edge-tech/memory-pkg");

    await expect(
      page.getByRole("heading", { level: 1, name: "memory-pkg" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /the problem/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /back to cutting edge tech/i }),
    ).toBeVisible();
  });

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/cutting-edge-tech/memory-pkg");

    const related = page.getByRole("region", { name: /more on the cutting edge/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/sylphie"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/sylphie-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/enforcement-hooks"]'),
    ).toBeVisible();
  });

  test("Article TOC nav lists at least three anchors", async ({ page }) => {
    await page.goto("/cutting-edge-tech/memory-pkg");

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
    await page.goto("/cutting-edge-tech/sylphie-pkg");

    await expect(
      page.getByRole("heading", { level: 1, name: "sylphie-pkg" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /the problem/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /back to cutting edge tech/i }),
    ).toBeVisible();
  });

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/cutting-edge-tech/sylphie-pkg");

    const related = page.getByRole("region", { name: /more on the cutting edge/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/sylphie"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/memory-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/enforcement-hooks"]'),
    ).toBeVisible();
  });
});

test.describe("Sylphie case study", () => {
  test("renders MDX body and prev/next nav", async ({ page }) => {
    await page.goto("/cutting-edge-tech/sylphie");

    await expect(
      page.getByRole("heading", { level: 1, name: "Sylphie" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: /thesis/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /drive engine/i }),
    ).toBeVisible();

    await expect(page.getByRole("link", { name: /back to cutting edge tech/i })).toBeVisible();
  });

  test("renders the appended Why it matters + Code map sections", async ({
    page,
  }) => {
    await page.goto("/cutting-edge-tech/sylphie");

    await expect(
      page.getByRole("heading", { level: 2, name: /why it matters/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: /code map/i }),
    ).toBeVisible();
  });

  test("Article TOC nav covers the appended sections", async ({ page }) => {
    await page.goto("/cutting-edge-tech/sylphie");

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
    await page.goto("/cutting-edge-tech/sylphie");

    const related = page.getByRole("region", { name: /more on the cutting edge/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/memory-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/sylphie-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/enforcement-hooks"]'),
    ).toBeVisible();
  });

  test("navigates back to /cutting-edge-tech via the back link", async ({ page }) => {
    await page.goto("/cutting-edge-tech/sylphie");
    await page.getByRole("link", { name: /back to cutting edge tech/i }).click();
    await expect(page).toHaveURL(/\/cutting-edge-tech\/?$/);
  });
});

test.describe("Enforcement Hooks case study", () => {
  test("renders the H1 title from i18n and a body heading", async ({
    page,
  }) => {
    await page.goto("/cutting-edge-tech/enforcement-hooks");

    await expect(
      page.getByRole("heading", { level: 1, name: "Enforcement Hooks" }),
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { level: 2, name: /the problem/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /back to cutting edge tech/i }),
    ).toBeVisible();
  });

  test("Related work links to all three sibling cases", async ({ page }) => {
    await page.goto("/cutting-edge-tech/enforcement-hooks");

    const related = page.getByRole("region", { name: /more on the cutting edge/i });
    await expect(related).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/sylphie"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/memory-pkg"]'),
    ).toBeVisible();
    await expect(
      related.locator('a[href="/cutting-edge-tech/sylphie-pkg"]'),
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
      .getByRole("link", { name: /^Cutting Edge Tech$/ });
    await expect(drawerWorkLink).toBeVisible();

    await drawerWorkLink.click();
    await expect(page).toHaveURL(/\/cutting-edge-tech\/?$/);
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
    const navWorkLink = page.getByRole("link", { name: "Cutting Edge Tech", exact: true });
    await expect(navWorkLink).toBeVisible();

    await navWorkLink.click();
    await expect(page).toHaveURL(/\/cutting-edge-tech\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  });
});

test.describe("Legacy /work redirects", () => {
  // serve.json (committed at public/serve.json, copied to dist/ by Vite)
  // tells `serve` to 301 /work -> /cutting-edge-tech and /work/:slug -> /cutting-edge-tech/:slug.
  // The dev server (Vite) does NOT honor serve.json, so these assertions
  // exercise the production runtime — we hit them via `npm run build &&
  // npm run start` in CI, and via the live URL post-deploy.
  //
  // Locally on `npm run dev`, /work returns the SPA index (the TanStack
  // catch-all). The assertions below would fail against vite — they're
  // gated on a non-vite baseURL.
  const SERVE_BASE_URL = process.env.SERVE_BASE_URL;

  test.skip(
    !SERVE_BASE_URL,
    "Set SERVE_BASE_URL to a `serve dist` (or production) origin to exercise the 301s. " +
      "The Vite dev server doesn't honor serve.json.",
  );

  test("/work returns 301 to /cutting-edge-tech", async ({ request }) => {
    const r = await request.get(`${SERVE_BASE_URL}/work`, {
      maxRedirects: 0,
    });
    expect(r.status()).toBe(301);
    expect(r.headers()["location"]).toMatch(/\/cutting-edge-tech\/?$/);
  });

  test("/work/<slug> returns 301 to /cutting-edge-tech/<slug>", async ({ request }) => {
    const r = await request.get(`${SERVE_BASE_URL}/work/sylphie`, {
      maxRedirects: 0,
    });
    expect(r.status()).toBe(301);
    expect(r.headers()["location"]).toMatch(/\/cutting-edge-tech\/sylphie\/?$/);
  });
});

import { expect, test } from "@playwright/test";

test.describe("Writing index", () => {
  test("renders header and the empty-state copy when no posts exist", async ({
    page,
  }) => {
    await page.goto("/writing");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/no posts yet/i)).toBeVisible();
  });
});

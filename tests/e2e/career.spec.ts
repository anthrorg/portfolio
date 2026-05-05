import { expect, test } from "@playwright/test";

test.describe("Career page", () => {
  test("renders populated section headings + resume download link", async ({
    page,
  }) => {
    await page.goto("/career");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    for (const section of ["Roles", "Education", "Languages"]) {
      await expect(
        page.getByRole("heading", { level: 2, name: section }),
      ).toBeVisible();
    }

    await expect(
      page.getByRole("heading", { level: 2, name: "Certifications" }),
    ).toHaveCount(0);

    const downloadLink = page.getByRole("link", { name: /download resume/i });
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute(
      "href",
      "/jim-tisdale-resume.pdf",
    );
    await expect(downloadLink).toHaveAttribute("download", "");
  });
});

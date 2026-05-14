import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays loading screen then shows content", async ({ page }) => {
    await expect(page.locator("text=GK.dev")).toBeVisible({ timeout: 500 });
    await page.waitForTimeout(2500);
    await expect(page.locator("text=GK.dev")).not.toBeVisible();
  });

  test("has all main sections", async ({ page }) => {
    await page.waitForTimeout(2500);
    await expect(page.locator("#hero")).toBeAttached();
    await expect(page.locator("#o-mnie")).toBeAttached();
    await expect(page.locator("#umiejetnosci")).toBeAttached();
    await expect(page.locator("#projekty")).toBeAttached();
    await expect(page.locator("#kontakt")).toBeAttached();
  });

  test("navbar links scroll to correct sections", async ({ page }) => {
    await page.waitForTimeout(2500);
    const links = [
      { text: "O mnie", id: "o-mnie" },
      { text: "Umiejętności", id: "umiejetnosci" },
      { text: "Projekty", id: "projekty" },
      { text: "Kontakt", id: "kontakt" },
    ];

    for (const link of links) {
      await page.locator("nav a", { hasText: link.text }).click();
      await expect(page.locator(`#${link.id}`)).toBeInViewport();
    }
  });
});

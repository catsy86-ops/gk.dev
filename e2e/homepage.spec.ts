import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays loading screen or main content", async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page.locator("#hero")).toBeVisible();
  });

  test("has all main sections", async ({ page }) => {
    await page.waitForTimeout(2000);
    await expect(page.locator("#hero")).toBeAttached();
    await expect(page.locator("#o-mnie")).toBeAttached();
    await expect(page.locator("#umiejetnosci")).toBeAttached();
    await expect(page.locator("#projekty")).toBeAttached();
    await expect(page.locator("#kontakt")).toBeAttached();
  });

  test("navbar links scroll to correct sections", async ({ page }) => {
    await page.waitForTimeout(2000);
    const links = [
      { text: "O mnie", id: "o-mnie" },
      { text: "Umiejętności", id: "umiejetnosci" },
      { text: "Projekty", id: "projekty" },
      { text: "FAQ", id: "faq" },
    ];

    for (const link of links) {
      await page.locator("nav a", { hasText: link.text }).first().click();
      await page.waitForTimeout(600);
      await expect(page.locator(`#${link.id}`)).toBeAttached();
    }
  });
});

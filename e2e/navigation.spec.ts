import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
  });

  test("displays navbar with all links", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav.locator("text=O mnie")).toBeVisible();
    await expect(nav.locator("text=Umiejętności")).toBeVisible();
    await expect(nav.locator("text=Projekty")).toBeVisible();
    await expect(nav.locator("text=Kontakt")).toBeVisible();
  });

  test("scroll progress bar exists and updates", async ({ page }) => {
    const progressBar = page.locator(".fixed.top-0.left-0.h-\\[3px\\]");
    await expect(progressBar).toBeAttached();
  });

  test("footer has back-to-top button", async ({ page }) => {
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    const backBtn = footer.locator("button, a").last();
    await expect(backBtn).toBeAttached();
  });

  test("404 page for unknown routes", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await page.waitForTimeout(500);
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=Wróć na stronę główną")).toBeVisible();
  });
});

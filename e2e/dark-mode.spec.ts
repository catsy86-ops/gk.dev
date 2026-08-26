import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
  });

  test("toggles theme on button click", async ({ page }) => {
    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");

    const themeToggleBtn = page.locator('button[aria-label*="motyw" i], button[aria-label*="theme" i]').first();
    await themeToggleBtn.click();
    await page.waitForTimeout(500);
    const updatedClass = await html.getAttribute("class");
    expect(updatedClass).not.toBe(initialClass);
  });

  test("persists theme across page reload", async ({ page }) => {
    const themeToggleBtn = page.locator('button[aria-label*="motyw" i], button[aria-label*="theme" i]').first();
    await themeToggleBtn.click();
    await page.waitForTimeout(500);
    const currentClass = await page.locator("html").getAttribute("class");

    await page.reload();
    await page.waitForTimeout(2000);
    await expect(page.locator("html")).toHaveAttribute("class", currentClass || "");
  });
});

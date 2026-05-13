import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
  });

  test("toggles theme on button click", async ({ page }) => {
    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");

    await page.locator('button[aria-label*="ciemny" i], button[aria-label*="dark" i]').first().click();
    await expect(html).toHaveAttribute("class", /dark/);

    await page.locator('button[aria-label*="jasny" i], button[aria-label*="light" i]').first().click();
    const finalClass = await html.getAttribute("class");
    expect(finalClass?.includes("dark")).toBe(!initialClass?.includes("dark"));
  });

  test("persists theme across page reload", async ({ page }) => {
    await page.locator('button[aria-label*="ciemny" i], button[aria-label*="dark" i]').first().click();
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);

    await page.reload();
    await page.waitForTimeout(2500);
    await expect(page.locator("html")).toHaveAttribute("class", /dark/);
  });
});

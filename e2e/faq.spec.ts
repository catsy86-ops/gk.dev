import { test, expect } from "@playwright/test";

test.describe("FAQ Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
  });

  test("accordion items open and close on click", async ({ page }) => {
    const firstTrigger = page.locator('[data-radix-accordion-trigger]').first();
    const firstContent = page.locator('[data-radix-accordion-content]').first();

    await firstTrigger.click();
    await expect(firstContent).toBeVisible();

    await firstTrigger.click();
    await expect(firstContent).not.toBeVisible();
  });

  test("clicking one item does not close another (multiple open allowed)", async ({ page }) => {
    const triggers = page.locator('[data-radix-accordion-trigger]');
    const contents = page.locator('[data-radix-accordion-content]');

    await triggers.nth(0).click();
    await triggers.nth(1).click();

    await expect(contents.nth(0)).toBeVisible();
    await expect(contents.nth(1)).toBeVisible();
  });
});

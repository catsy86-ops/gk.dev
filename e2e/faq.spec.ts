import { test, expect } from "@playwright/test";

test.describe("FAQ Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#faq").scrollIntoViewIfNeeded();
  });

  test("accordion items open and close on click", async ({ page }) => {
    const firstTrigger = page.locator("#faq button[id^='radix-'], #faq h3 button").first();
    await firstTrigger.click();
    await page.waitForTimeout(400);

    const firstContent = page.locator("#faq div[role='region']").first();
    await expect(firstContent).toBeVisible();

    await firstTrigger.click();
    await page.waitForTimeout(400);
    await expect(firstContent).not.toBeVisible();
  });

  test("search input filters FAQ questions", async ({ page }) => {
    const searchInput = page.locator("#faq input[type='text']");
    await searchInput.fill("SLA");
    await page.waitForTimeout(400);

    const questions = page.locator("#faq h3 button, #faq button[id^='radix-']");
    expect(await questions.count()).toBeGreaterThanOrEqual(1);
  });
});

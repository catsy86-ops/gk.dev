import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
    await page.locator("#kontakt").scrollIntoViewIfNeeded();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.locator('#kontakt button[type="submit"]').click();
    await expect(page.locator("text=Imi\\u0119 jest wymagane")).toBeVisible();
    await expect(page.locator("text=Email jest wymagany")).toBeVisible();
    await expect(page.locator("text=Wiadomo\\u015b\\u0107 jest wymagana")).toBeVisible();
  });

  test("validates email format", async ({ page }) => {
    await page.locator('#kontakt input[placeholder="Email"]').fill("not-an-email");
    await page.locator('#kontakt button[type="submit"]').click();
    await expect(page.locator("text=Nieprawid\\u0142owy format email")).toBeVisible();
  });

  test("submits successfully with valid data", async ({ page }) => {
    await page.locator('#kontakt input[placeholder="Imi\\u0119"]').fill("Jan Kowalski");
    await page.locator('#kontakt input[placeholder="Email"]').fill("jan@example.com");
    await page.locator('#kontakt textarea[placeholder="Wiadomo\\u015b\\u0107"]').fill("Test message content.");

    await page.locator('#kontakt button[type="submit"]').click();

    await expect(page.locator("text=Wiadomo\\u015b\\u0107 wys\\u0142ana!")).toBeVisible({ timeout: 3000 });

    await expect(page.locator('#kontakt input[placeholder="Imi\\u0119"]')).toHaveValue("");
    await expect(page.locator('#kontakt input[placeholder="Email"]')).toHaveValue("");
    await expect(page.locator('#kontakt textarea[placeholder="Wiadomo\\u015b\\u0107"]')).toHaveValue("");
  });

  test("shows loading state during submission", async ({ page }) => {
    await page.locator('#kontakt input[placeholder="Imi\\u0119"]').fill("Jan");
    await page.locator('#kontakt input[placeholder="Email"]').fill("jan@example.com");
    await page.locator('#kontakt textarea[placeholder="Wiadomo\\u015b\\u0107"]').fill("Test");

    await page.locator('#kontakt button[type="submit"]').click();
    await expect(page.locator('#kontakt button[type="submit"]:has-text("Wysy\\u0142anie")')).toBeVisible();
    await expect(page.locator('#kontakt button[type="submit"]')).toBeDisabled();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept external Formspree API calls to guarantee fast, deterministic test execution
    await page.route("**/formspree.io/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, next: "/thanks" }),
      });
    });

    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#kontakt").scrollIntoViewIfNeeded();
  });

  test("shows validation errors on empty submit", async ({ page }) => {
    await page.locator('#kontakt button[type="submit"]').click();
    await expect(page.locator("text=Imię jest wymagane")).toBeVisible();
    await expect(page.locator("text=Email jest wymagany")).toBeVisible();
    await expect(page.locator("text=Wiadomość jest wymagana")).toBeVisible();
  });

  test("validates email format", async ({ page }) => {
    await page.locator('#kontakt input[name="name"]').fill("Jan");
    await page.locator('#kontakt textarea[name="message"]').fill("Dzień dobry, test.");
    await page.locator('#kontakt input[name="email"]').fill("not-an-email");
    await page.locator('#kontakt button[type="submit"]').click();
    await expect(page.locator("text=Nieprawidłowy format email")).toBeVisible();
  });

  test("submits successfully with valid data", async ({ page }) => {
    await page.locator('#kontakt input[name="name"]').fill("Jan Kowalski");
    await page.locator('#kontakt input[name="email"]').fill("jan@example.com");
    await page.locator('#kontakt textarea[name="message"]').fill("Dzień dobry, chciałbym porozmawiać o projekcie platformy SaaS.");

    await page.locator('#kontakt button[type="submit"]').click();

    await expect(page.locator("text=Wiadomość wysłana!").first()).toBeVisible({ timeout: 5000 });
  });

  test("shows success notification after submission", async ({ page }) => {
    await page.locator('#kontakt input[name="name"]').fill("Jan");
    await page.locator('#kontakt input[name="email"]').fill("jan@example.com");
    await page.locator('#kontakt textarea[name="message"]').fill("Test wiadomość");

    await page.locator('#kontakt button[type="submit"]').click();
    await expect(page.locator("text=Wiadomość wysłana!").first()).toBeVisible({ timeout: 5000 });
  });
});

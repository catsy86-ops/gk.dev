# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contact-form.spec.ts >> Contact Form >> shows validation errors on empty submit
- Location: e2e\contact-form.spec.ts:10:3

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("Contact Form", () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto("/");
> 6  |     await page.waitForTimeout(2500);
     |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  7  |     await page.locator("#kontakt").scrollIntoViewIfNeeded();
  8  |   });
  9  | 
  10 |   test("shows validation errors on empty submit", async ({ page }) => {
  11 |     await page.locator('#kontakt button[type="submit"]').click();
  12 |     await expect(page.locator("text=Imi\\u0119 jest wymagane")).toBeVisible();
  13 |     await expect(page.locator("text=Email jest wymagany")).toBeVisible();
  14 |     await expect(page.locator("text=Wiadomo\\u015b\\u0107 jest wymagana")).toBeVisible();
  15 |   });
  16 | 
  17 |   test("validates email format", async ({ page }) => {
  18 |     await page.locator('#kontakt input[placeholder="Email"]').fill("not-an-email");
  19 |     await page.locator('#kontakt button[type="submit"]').click();
  20 |     await expect(page.locator("text=Nieprawid\\u0142owy format email")).toBeVisible();
  21 |   });
  22 | 
  23 |   test("submits successfully with valid data", async ({ page }) => {
  24 |     await page.locator('#kontakt input[placeholder="Imi\\u0119"]').fill("Jan Kowalski");
  25 |     await page.locator('#kontakt input[placeholder="Email"]').fill("jan@example.com");
  26 |     await page.locator('#kontakt textarea[placeholder="Wiadomo\\u015b\\u0107"]').fill("Test message content.");
  27 | 
  28 |     await page.locator('#kontakt button[type="submit"]').click();
  29 | 
  30 |     await expect(page.locator("text=Wiadomo\\u015b\\u0107 wys\\u0142ana!")).toBeVisible({ timeout: 3000 });
  31 | 
  32 |     await expect(page.locator('#kontakt input[placeholder="Imi\\u0119"]')).toHaveValue("");
  33 |     await expect(page.locator('#kontakt input[placeholder="Email"]')).toHaveValue("");
  34 |     await expect(page.locator('#kontakt textarea[placeholder="Wiadomo\\u015b\\u0107"]')).toHaveValue("");
  35 |   });
  36 | 
  37 |   test("shows loading state during submission", async ({ page }) => {
  38 |     await page.locator('#kontakt input[placeholder="Imi\\u0119"]').fill("Jan");
  39 |     await page.locator('#kontakt input[placeholder="Email"]').fill("jan@example.com");
  40 |     await page.locator('#kontakt textarea[placeholder="Wiadomo\\u015b\\u0107"]').fill("Test");
  41 | 
  42 |     await page.locator('#kontakt button[type="submit"]').click();
  43 |     await expect(page.locator('#kontakt button[type="submit"]:has-text("Wysy\\u0142anie")')).toBeVisible();
  44 |     await expect(page.locator('#kontakt button[type="submit"]')).toBeDisabled();
  45 |   });
  46 | });
  47 | 
```
import { test, expect } from "@playwright/test";

test.describe("E2E Scraper & Comprehensive Architecture Audit", () => {
  test("scrapes live homepage data, sections, and verifies all interactive modules", async ({ page }) => {
    // 1. Load Homepage
    await page.goto("/");
    await page.waitForTimeout(2500);

    // Scrape Brand Title & Meta
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();

    // 2. Scrape Hero Section
    const heroGreeting = await page.locator("#hero h1").innerText();
    const heroTypewriter = await page.locator("#hero div[aria-label*='Rola:']").innerText();
    expect(heroGreeting).toContain("Grzegorz");
    expect(heroTypewriter).toBeTruthy();

    // 3. Scrape Skills Section (Bento Grid)
    const skillsHeading = await page.locator("#umiejetnosci h2").innerText();
    expect(skillsHeading).toContain("Moje");
    const skillCards = await page.locator("#umiejetnosci h3").allInnerTexts();
    expect(skillCards.length).toBeGreaterThanOrEqual(6);

    // 4. Scrape & Audit Projects Section (Compact 4-column layout)
    const projectCategoryPills = await page.locator("#projekty button[type='button']").allInnerTexts();
    expect(projectCategoryPills.length).toBeGreaterThanOrEqual(4);

    // Test Project Search
    const searchInput = page.locator("#projekty input[type='text']");
    await searchInput.fill("SaaS");
    await page.waitForTimeout(400);
    const searchCount = await page.locator("#projekty").getByText(/znaleziono|found/i).innerText();
    expect(searchCount).toBeTruthy();
    await searchInput.fill("");

    // 5. Scrape JS Course Section & Interact with Quiz and Virtual Console
    const jsCourseHeading = await page.locator("#kurs-js h2").innerText();
    expect(jsCourseHeading).toContain("JavaScript");

    // Click module tab
    const moduleTabs = page.locator("#kurs-js button");
    if ((await moduleTabs.count()) > 0) {
      await moduleTabs.first().click();
    }

    // 6. Test Terminal Dialog Trigger
    const terminalButton = page.locator("button[aria-label*='Terminal']").first();
    if (await terminalButton.isVisible()) {
      await terminalButton.click();
      await page.waitForTimeout(600);
      await expect(page.locator("text=GK.dev Interactive Shell")).toBeVisible();

      // Type 'help' in terminal
      const terminalInput = page.locator("input[placeholder*='Wpisz polecenie']");
      if (await terminalInput.isVisible()) {
        await terminalInput.fill("help");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(300);
        await expect(page.locator("text=Dostępne polecenia CLI")).toBeVisible();
      }
      // Close terminal with Escape
      await page.keyboard.press("Escape");
    }

    // 7. Scrape FAQ Section
    const faqCount = await page.locator("#faq button").count();
    expect(faqCount).toBeGreaterThanOrEqual(4);

    // 8. Test 404 Route
    await page.goto("/undefined-route-check");
    await page.waitForTimeout(500);
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=Wróć na stronę główną")).toBeVisible();

    // Return to home
    await page.goto("/");
    await page.waitForTimeout(1000);
    await expect(page.locator("#hero")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

import { environment } from "../environments/environment";
import { ApiHelper } from "../helpers/api.helper";
import { HomePage } from "../pages/home.page";

test.describe("HomePage E2E Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
    // Wait for Angular router to complete navigation
    await page.waitForLoadState("networkidle");
    // Wait for the main content to be visible
    await page.waitForTimeout(3000);
  });

  test("should load home page successfully", async ({ page }) => {
    await expect(page).toHaveURL(environment.BASE_URL);
    // Wait for chat components to render
    await page
      .waitForSelector("app-chat-provider", { timeout: 10000 })
      .catch(() => {});
  });

  test("should display chat input field", async ({ page }) => {
    const input = page.locator("#chat-message-input");
    await input.waitFor({ state: "visible", timeout: 10000 });
    await expect(input).toBeVisible();
  });

  test("should have working input field", async ({ page }) => {
    const input = page.locator("#chat-message-input");
    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill("test input");
    await expect(input).toHaveValue("test input");
  });

  test("should send message via button", async ({ page }) => {
    const input = page.locator("#chat-message-input");
    const button = page.locator("#chat-send-button");

    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill("Hello test");
    await button.click();

    // Wait a bit for response
    await page.waitForTimeout(3000);
  });

  test("should not show error alert on successful request", async ({
    page,
  }) => {
    const input = page.locator("#chat-message-input");
    const button = page.locator("#chat-send-button");

    await input.waitFor({ state: "visible", timeout: 10000 });
    await input.fill("No error test");
    await button.click();

    await page.waitForTimeout(3000);
    const alert = page.locator(".alert-danger");
    const isVisible = await alert.isVisible().catch(() => false);
    expect(isVisible).toBe(false);
  });
});

test.describe("API E2E Tests (via Proxy)", () => {
  const api = new ApiHelper();

  test("should return health status from backend", async () => {
    const result = await api.getHealth();
    expect(result.status).toBe(200);
    expect(result.body.status).toBe("ok");
  });

  test("should send message to assistant and get response", async () => {
    const result = await api.postChat("Hello API test");
    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty("response");
  });

  test("should get models list", async () => {
    const result = await api.getModels();
    expect(result.status).toBe(200);
  });
});

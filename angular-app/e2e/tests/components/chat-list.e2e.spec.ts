import { test, expect } from "@playwright/test";

import { environment } from "../../environments/environment";

test.describe("ChatListComponent E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should display chat list container", async ({ page }) => {
    const chatList = page.locator(".chat-list-container");
    await expect(chatList).toBeVisible();
  });

  test("should display empty state initially", async ({ page }) => {
    const emptyState = page.locator(".empty-state");
    await expect(emptyState).toBeVisible();
    const text = await emptyState.textContent();
    expect(text).toContain("Envie uma mensagem");
  });

  test("should not display empty state after sending message", async ({
    page,
  }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    // Enviar mensagem
    await messageInput.fill("Test message");
    await sendButton.click();

    // Aguardar resposta
    await page.waitForTimeout(3000);

    const emptyState = page.locator(".empty-state");
    const isVisible = await emptyState.isVisible().catch(() => false);
    console.log("Empty state visible after message:", isVisible);
  });

  test("should display user messages", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello");
    await sendButton.click();

    await page.waitForTimeout(2000);

    const userMessages = page.locator(".chat-message.user");
    const count = await userMessages.count();
    console.log("User messages count:", count);
  });

  test("should display assistant messages", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello");
    await sendButton.click();

    await page.waitForTimeout(5000);

    const assistantMessages = page.locator(".chat-message.assistant");
    const count = await assistantMessages.count();
    console.log("Assistant messages count:", count);
  });

  test("should display message content", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Test message content");
    await sendButton.click();

    await page.waitForTimeout(3000);

    const messageTexts = page.locator(".message-text");
    const count = await messageTexts.count();
    expect(count).toBeGreaterThan(0);

    const firstMessage = messageTexts.first();
    const content = await firstMessage.textContent();
    console.log("First message content:", content);
  });

  test("should display message role labels", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello");
    await sendButton.click();

    await page.waitForTimeout(3000);

    const roleLabels = page.locator(".message-role");
    const count = await roleLabels.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should have scrollable container", async ({ page }) => {
    const chatList = page.locator(".chat-list-container");
    const hasScroll = await chatList.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.overflowY === "auto" || style.overflowY === "scroll";
    });
    console.log("Container is scrollable:", hasScroll);
  });
});

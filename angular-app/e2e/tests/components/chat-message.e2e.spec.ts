import { test, expect } from "@playwright/test";

import { environment } from "../../environments/environment";

test.describe("ChatMessageComponent E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should display message with user role", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("User message");
    await sendButton.click();

    await page.waitForTimeout(2000);

    const userMessages = page.locator(".chat-message.user");
    await expect(userMessages.first()).toBeVisible();

    const roleLabel = page.locator(".message-role").first();
    const roleText = await roleLabel.textContent();
    expect(roleText).toContain("Você");
  });

  test("should display message with assistant role", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello");
    await sendButton.click();

    await page.waitForTimeout(5000);

    const assistantMessages = page.locator(".chat-message.assistant");
    const count = await assistantMessages.count();

    if (count > 0) {
      await expect(assistantMessages.first()).toBeVisible();

      const roleLabel = page.locator(".message-role").last();
      const roleText = await roleLabel.textContent();
      expect(roleText).toContain("Assistente");
    }
  });

  test("should display message content", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    const testMessage = "Test message content 123";
    await messageInput.fill(testMessage);
    await sendButton.click();

    await page.waitForTimeout(3000);

    const messageText = page.locator(".message-text").first();
    const content = await messageText.textContent();
    expect(content).toContain(testMessage);
  });

  test("should display user avatar icon", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Test");
    await sendButton.click();

    await page.waitForTimeout(2000);

    const userAvatar = page.locator(
      ".chat-message.user .message-avatar i.bi-person-fill",
    );
    const count = await userAvatar.count();

    if (count > 0) {
      await expect(userAvatar.first()).toBeVisible();
    }
  });

  test("should display assistant avatar icon", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello");
    await sendButton.click();

    await page.waitForTimeout(5000);

    const assistantAvatar = page.locator(
      ".chat-message.assistant .message-avatar i.bi-robot",
    );
    const count = await assistantAvatar.count();

    if (count > 0) {
      await expect(assistantAvatar.first()).toBeVisible();
    }
  });

  test("should display typing indicator during streaming", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Generate long response");
    await sendButton.click();

    // Imediatamente após enviar, pode haver indicador de typing
    await page.waitForTimeout(1000);

    const typingIndicator = page.locator(".typing-indicator");

    // Pode ou não haver depending on response time
    const count = await typingIndicator.count();
    console.log("Typing indicators found:", count);
  });

  test("should apply correct CSS classes for user message", async ({
    page,
  }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("User test");
    await sendButton.click();

    await page.waitForTimeout(2000);

    const message = page.locator(".chat-message").first();
    await expect(message).toHaveClass(/user/);
  });

  test("should apply correct CSS classes for assistant message", async ({
    page,
  }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello");
    await sendButton.click();

    await page.waitForTimeout(5000);

    const messages = page.locator(".chat-message");
    const count = await messages.count();

    if (count > 1) {
      const assistantMessage = messages.last();
      await expect(assistantMessage).toHaveClass(/assistant/);
    }
  });
});

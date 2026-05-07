import { test, expect } from "@playwright/test";

import { environment } from "../../environments/environment";

/**
 * ChatInputComponent E2E Tests
 * Testa o componente de input de mensagem e envio
 */
test.describe("ChatInputComponent", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  // ============================================
  // Testes de Exibição
  // ============================================

  test("should display message input field", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    await expect(messageInput).toBeVisible();
  });

  test("should have input with correct type", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const type = await messageInput.getAttribute("type");
    expect(type).toBe("text");
  });

  test("should have placeholder text", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const placeholder = await messageInput.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
    expect(placeholder?.length).toBeGreaterThan(0);
  });

  test("should display send button", async ({ page }) => {
    const sendButton = page.locator("#chat-send-button");
    await expect(sendButton).toBeVisible();
  });

  test("should have send button with title/tooltip", async ({ page }) => {
    const sendButton = page.locator("#chat-send-button");
    const title = await sendButton.getAttribute("title");
    expect(title).toBeTruthy();
    expect(title?.toLowerCase()).toContain("enviar");
  });

  test("should have correct CSS classes", async ({ page }) => {
    const input = page.locator("#chat-message-input");
    await expect(input).toHaveClass(/form-control/);

    const button = page.locator("#chat-send-button");
    await expect(button).toHaveClass(/btn-send/);
  });

  // ============================================
  // Testes de Estado Inicial
  // ============================================

  test("should have empty input on init", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const value = await messageInput.inputValue();
    expect(value).toBe("");
  });

  test("should disable send button when input is empty", async ({ page }) => {
    const sendButton = page.locator("#chat-send-button");
    await expect(sendButton).toBeDisabled();
  });

  test("should have autocomplete off", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const autocomplete = await messageInput.getAttribute("autocomplete");
    expect(autocomplete).toBe("off");
  });

  // ============================================
  // Testes de Interação - Botão
  // ============================================

  test("should enable send button when input has text", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Test message");
    await expect(sendButton).toBeEnabled();
  });

  test("should disable send button when input becomes empty", async ({
    page,
  }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Test message");
    await expect(sendButton).toBeEnabled();

    await messageInput.fill("");
    await expect(sendButton).toBeDisabled();
  });

  test("should clear input after sending via button click", async ({
    page,
  }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello World");
    await sendButton.click();

    await expect(messageInput).toHaveValue("");
  });

  test("should NOT send message if button is disabled", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    // Tentar clicar com input vazio
    await sendButton.click();

    // Input deve permanecer vazio
    const value = await messageInput.inputValue();
    expect(value).toBe("");
  });

  test("should have send button with correct type", async ({ page }) => {
    const sendButton = page.locator("#chat-send-button");
    const type = await sendButton.getAttribute("type");
    expect(type).toBe("button");
  });

  // ============================================
  // Testes de Interação - Teclado
  // ============================================

  test("should clear input after sending via Enter key", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");

    await messageInput.fill("Test Enter");
    await messageInput.press("Enter");

    await expect(messageInput).toHaveValue("");
  });

  test("should not send empty message on Enter", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    // Press Enter com input vazio
    await messageInput.press("Enter");

    // Input deve permanecer vazio
    const value = await messageInput.inputValue();
    expect(value).toBe("");

    // Send button deve continuar disabled
    await expect(sendButton).toBeDisabled();
  });

  test("should not send on Shift+Enter (new line)", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");

    await messageInput.fill("Test");
    await messageInput.press("Shift+Enter");

    // Input deve manter o texto (não limpar)
    const value = await messageInput.inputValue();
    expect(value).toBe("Test");
  });

  // ============================================
  // Testes de Validação
  // ============================================

  test("should trim whitespace when sending", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    // Input com espaços apenas
    await messageInput.fill("   ");
    await expect(sendButton).toBeDisabled();
  });

  test("should accept multiline input before sending", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");

    // Input pode ter múltiplas linhas (mas Enter envia)
    await messageInput.fill("Line 1\nLine 2");
    const value = await messageInput.inputValue();
    expect(value).toContain("Line 1");
  });

  test("should handle very long messages", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    // Mensagem longa
    const longMessage = "A".repeat(1000);
    await messageInput.fill(longMessage);

    await expect(sendButton).toBeEnabled();
  });

  // ============================================
  // Testes de HTML Structure
  // ============================================

  test("should have correct HTML structure", async ({ page }) => {
    const container = page.locator(".chat-input-container");
    const wrapper = container.locator(".input-wrapper");
    const input = wrapper.locator("input");
    const button = wrapper.locator("button");

    await expect(container).toBeVisible();
    await expect(wrapper).toBeVisible();
    await expect(input).toBeVisible();
    await expect(button).toBeVisible();
  });
});

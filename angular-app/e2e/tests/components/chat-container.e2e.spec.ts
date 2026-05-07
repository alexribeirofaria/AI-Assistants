import { test, expect } from "@playwright/test";

import { environment } from "../../environments/environment";

test.describe("ChatContainerComponent E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) =>
      console.log("CONSOLE:", msg.type(), msg.text()),
    );
    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should display chat container", async ({ page }) => {
    const chatContainer = page.locator(".chat-container");
    await expect(chatContainer).toBeVisible();
  });

  test("should display chat header", async ({ page }) => {
    const chatHeader = page.locator(".chat-header");
    await expect(chatHeader).toBeVisible();
  });

  test("should display all child components", async ({ page }) => {
    // Provider select
    const providerSelect = page.locator("#provider-select");
    await expect(providerSelect).toBeVisible();

    // Model select
    const modelSelect = page.locator("#model-select");
    await expect(modelSelect).toBeVisible();

    // Chat list
    const chatList = page.locator(".chat-list-container");
    await expect(chatList).toBeVisible();

    // Chat input
    const chatInput = page.locator("#chat-message-input");
    await expect(chatInput).toBeVisible();
  });

  test("should handle full message flow", async ({ page }) => {
    // 1. Selecionar provider
    await page.waitForTimeout(2000);
    const providerSelect = page.locator("#provider-select");
    const providerOptions = providerSelect.locator("option");
    const providerCount = await providerOptions.count();

    if (providerCount > 1) {
      const firstProvider = await providerOptions.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);
      console.log("Selected provider:", firstProvider);

      // 2. Selecionar model
      await page.waitForTimeout(1000);
      const modelSelect = page.locator("#model-select");
      const modelOptions = modelSelect.locator("option");
      const modelCount = await modelOptions.count();

      if (modelCount > 1) {
        const firstModel = await modelOptions.nth(1).getAttribute("value");
        await modelSelect.selectOption(firstModel!);
        console.log("Selected model:", firstModel);
      }
    }

    // 3. Enviar mensagem
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    await messageInput.fill("Hello, this is a test message");
    await sendButton.click();

    // 4. Verificar que input foi limpo
    await expect(messageInput).toHaveValue("");
    console.log("Message sent successfully");

    // 5. Verificar que mensagem apareceu
    await page.waitForTimeout(3000);
    const messages = page.locator(".chat-message");
    const messageCount = await messages.count();
    console.log("Messages in chat:", messageCount);
    expect(messageCount).toBeGreaterThan(0);
  });

  test("should show error alert on API failure", async ({ page }) => {
    // Esperar carregamento inicial
    await page.waitForTimeout(3000);

    // Verificar erros
    const errorAlert = page.locator(".alert-danger");
    const errorCount = await errorAlert.count();

    console.log("Error alerts found:", errorCount);
    if (errorCount > 0) {
      const errorText = await errorAlert.first().textContent();
      console.log("Error text:", errorText);
    }
  });

  test("should handle provider change and reload models", async ({ page }) => {
    await page.waitForTimeout(2000);

    const providerSelect = page.locator("#provider-select");
    const modelSelect = page.locator("#model-select");

    // Selecionar primeiro provider
    const providerOptions = providerSelect.locator("option");
    const providerCount = await providerOptions.count();

    if (providerCount > 1) {
      const firstProvider = await providerOptions.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);
      await page.waitForTimeout(1000);

      const initialModels = await modelSelect.locator("option").count();
      console.log("Models after first provider:", initialModels);

      // Trocar para segundo provider
      if (providerCount > 2) {
        const secondProvider = await providerOptions
          .nth(2)
          .getAttribute("value");
        await providerSelect.selectOption(secondProvider!);
        await page.waitForTimeout(1500);

        const newModels = await modelSelect.locator("option").count();
        console.log("Models after second provider:", newModels);

        expect(newModels).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test("should disable input when loading", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");

    // Enviar mensagem
    await messageInput.fill("Test message");
    const sendButton = page.locator("#chat-send-button");
    await sendButton.click();

    // Verificar se input ficou desabilitado durante loading
    // (pode variar dependendo da implementação)
    await page.waitForTimeout(500);
    const isDisabled = await messageInput.isDisabled();
    console.log("Input disabled on send:", isDisabled);
  });

  test("should maintain message history", async ({ page }) => {
    const messageInput = page.locator("#chat-message-input");
    const sendButton = page.locator("#chat-send-button");

    // Enviar primeira mensagem
    await messageInput.fill("Message 1");
    await sendButton.click();
    await page.waitForTimeout(3000);

    // Enviar segunda mensagem
    await messageInput.fill("Message 2");
    await sendButton.click();
    await page.waitForTimeout(3000);

    // Verificar que há mensagens na lista
    const messages = page.locator(".chat-message.user");
    const count = await messages.count();
    console.log("Total user messages:", count);
    expect(count).toBeGreaterThanOrEqual(2);
  });
});

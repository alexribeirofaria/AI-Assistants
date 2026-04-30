import { Page, Locator } from "@playwright/test";

import { environment } from "../environments/environment";

export class HomePage {
  readonly page: Page;
  readonly chatProviderSelector: Locator;
  readonly chatListModelsSelector: Locator;
  readonly chatInput: Locator;
  readonly chatSendButton: Locator;
  readonly chatList: Locator;
  readonly errorAlert: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.chatProviderSelector = page.locator("app-chat-provider");
    this.chatListModelsSelector = page.locator("app-chat-list-models");
    this.chatInput = page.locator("#chat-message-input");
    this.chatSendButton = page.locator("#chat-send-button");
    this.chatList = page.locator("app-chat-list");
    this.errorAlert = page.locator(".alert-danger");
    this.loadingIndicator = page.locator(".spinner-border");
  }

  async navigate(): Promise<void> {
    await this.page.goto(environment.BASE_URL);
  }

  async sendMessage(message: string): Promise<void> {
    await this.chatInput.fill(message);
    await this.chatSendButton.click();
  }

  async waitForResponse(timeout: number = 15000): Promise<void> {
    await this.page.waitForTimeout(2000);
  }

  async getErrorMessage(): Promise<string | null> {
    const alert = this.errorAlert;
    if (await alert.isVisible().catch(() => false)) {
      return await alert.textContent();
    }
    return null;
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible().catch(() => false);
  }
}

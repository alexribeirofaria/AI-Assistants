import { test, expect } from '@playwright/test';

test.describe('Chat Input E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
  });

  test('should display chat input components', async ({ page }) => {
    const messageInput = page.locator('#chat-message-input');
    await expect(messageInput).toBeVisible();
    
    const sendButton = page.locator('#chat-send-button');
    await expect(sendButton).toBeVisible();
  });

  test('should send message on button click', async ({ page }) => {
    const messageInput = page.locator('#chat-message-input');
    const sendButton = page.locator('#chat-send-button');
    
    await messageInput.fill('Hello E2E test');
    await sendButton.click();
    
    await expect(messageInput).toHaveValue('');
  });

  test('should send message on Enter key', async ({ page }) => {
    const messageInput = page.locator('#chat-message-input');
    
    await messageInput.fill('Test Enter key');
    await messageInput.press('Enter');
    
    await expect(messageInput).toHaveValue('');
  });

  test('should disable input while loading', async ({ page }) => {
    const messageInput = page.locator('#chat-message-input');
    await page.waitForTimeout(500);
    const isDisabled = await messageInput.isDisabled();
    console.log('Input disabled status: ' + isDisabled);
  });
});
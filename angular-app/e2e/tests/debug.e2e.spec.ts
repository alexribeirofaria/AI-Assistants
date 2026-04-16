import { test, expect } from '@playwright/test';
import { ApiHelper } from '../helpers/api.helper';

test.describe('Debug DOM Tests', () => {
  test('should show full page content', async ({ page }) => {
    page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
    
    await page.goto('http://localhost:4200/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);
    
    // Get page content
    const content = await page.content();
    console.log('PAGE LENGTH:', content.length);
    
    // Check for router-outlet
    const routerOutlet = await page.locator('router-outlet').count();
    console.log('router-outlet count:', routerOutlet);
    
    // Check all input elements
    const inputs = await page.locator('input').count();
    console.log('input count:', inputs);
    
    // List all visible elements
    const body = await page.locator('body').innerHTML();
    console.log('BODY HTML:', body.substring(0, 2000));
    
    expect(true).toBe(true);
  });
  
  test('should find chat input by various selectors', async ({ page }) => {
    page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
    
    await page.goto('http://localhost:4200/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    // Try different selectors
    const selectors = [
      '#chat-message-input',
      'input.form-control',
      'input[type="text"]',
      'input[placeholder*="mensagem"]',
      'input',
    ];
    
    for (const sel of selectors) {
      const count = await page.locator(sel).count();
      console.log(sel + ':', count);
    }
    
    expect(true).toBe(true);
  });
});

test.describe('API E2E Tests (via Proxy)', () => {
  const api = new ApiHelper();

  test('should return health status from backend', async () => {
    const result = await api.getHealth();
    expect(result.status).toBe(200);
    expect(result.body.status).toBe('ok');
  });

  test('should send message to assistant and get response', async () => {
    const result = await api.postChat('Hello API test');
    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('response');
  });

  test('should get models list', async () => {
    const result = await api.getModels();
    expect(result.status).toBe(200);
  });
});

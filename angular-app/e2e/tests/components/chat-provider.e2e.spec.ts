import { test, expect } from "@playwright/test";
import { environment } from "../../environments/environment";

test.describe("ChatProviderComponent E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) =>
      console.log("CONSOLE:", msg.type(), msg.text()),
    );
    page.on("response", (response) => {
      if (response.url().includes("models")) {
        console.log("RESPONSE:", response.status(), response.url());
      }
    });

    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should display provider select element", async ({ page }) => {
    const providerSelect = page.locator("#provider-select");
    await expect(providerSelect).toBeVisible();
  });

  test("should have default option in provider select", async ({ page }) => {
    const providerSelect = page.locator("#provider-select");
    const firstOption = providerSelect.locator("option").first();
    
    // A opção padrão existe no DOM - pode estar visível ou oculta dependendo do provider selecionado
    const count = await providerSelect.locator("option").count();
    expect(count).toBeGreaterThan(0);
    
    const text = await firstOption.textContent();
    expect(text).toContain("Selecione um provider");
  });

  test("should load providers from API", async ({ page }) => {
    // Aguardar carregamento dos providers
    await page.waitForTimeout(3000);

    const providerSelect = page.locator("#provider-select");
    const options = providerSelect.locator("option");
    const count = await options.count();

    console.log("Provider options count:", count);

    // Deve ter mais de 1 opção (padrão + providers)
    expect(count).toBeGreaterThan(1);
  });

  test("should display provider names in options", async ({ page }) => {
    await page.waitForTimeout(3000);

    const providerSelect = page.locator("#provider-select");
    const options = providerSelect.locator("option");
    const count = await options.count();

    if (count > 1) {
      // Verificar que há providers específicos
      const secondOption = options.nth(1);
      const value = await secondOption.getAttribute("value");
      expect(value).toBeTruthy();
      console.log("First provider value:", value);
    }
  });

  test("should change provider on selection", async ({ page }) => {
    await page.waitForTimeout(3000);

    const providerSelect = page.locator("#provider-select");
    const options = providerSelect.locator("option");
    const count = await options.count();

    if (count > 1) {
      const firstProvider = await options.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);

      // Verificar que a seleção mudou
      const selectedValue = await providerSelect.evaluate(
        (el) => (el as HTMLSelectElement).value,
      );
      console.log("Selected provider:", selectedValue);
      expect(selectedValue).toBe(firstProvider);
    }
  });

  test("should have form-label for provider", async ({ page }) => {
    const label = page.locator('label[for="provider-select"]');
    await expect(label).toBeVisible();
    const text = await label.textContent();
    expect(text).toContain("Provider");
  });
});

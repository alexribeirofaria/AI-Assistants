import { test, expect } from "@playwright/test";
import { environment } from "../../environments/environment";

test.describe("ChatListModelsComponent E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) =>
      console.log("CONSOLE:", msg.type(), msg.text()),
    );
    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should display model select element", async ({ page }) => {
    const modelSelect = page.locator("#model-select");
    await expect(modelSelect).toBeVisible();
  });

  test("should have default option in model select", async ({ page }) => {
    const modelSelect = page.locator("#model-select");
    
    // A opção padrão existe no DOM - pode estar visível ou oculta dependendo do model selecionado
    const count = await modelSelect.locator("option").count();
    expect(count).toBeGreaterThan(0);
    
    const firstOption = modelSelect.locator("option").first();
    const text = await firstOption.textContent();
    expect(text).toContain("Selecione um modelo");
  });

  test("should have form-label for model", async ({ page }) => {
    const label = page.locator('label[for="model-select"]');
    await expect(label).toBeVisible();
    const text = await label.textContent();
    expect(text).toContain("Modelo");
  });

  test("should load models after provider is selected", async ({ page }) => {
    // Primeiro selecionar um provider
    const providerSelect = page.locator("#provider-select");
    await page.waitForTimeout(2000);

    const providerOptions = providerSelect.locator("option");
    const providerCount = await providerOptions.count();

    if (providerCount > 1) {
      const firstProvider = await providerOptions.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);

      // Aguardar carregar models
      await page.waitForTimeout(2000);

      const modelSelect = page.locator("#model-select");
      const modelOptions = modelSelect.locator("option");
      const modelCount = await modelOptions.count();

      console.log("Model options count after provider select:", modelCount);
      expect(modelCount).toBeGreaterThan(1);
    }
  });

  test("should change model on selection", async ({ page }) => {
    await page.waitForTimeout(2000);

    // Selecionar provider primeiro
    const providerSelect = page.locator("#provider-select");
    const providerOptions = providerSelect.locator("option");
    const providerCount = await providerOptions.count();

    if (providerCount > 1) {
      const firstProvider = await providerOptions.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);
      await page.waitForTimeout(2000);

      // Agora selecionar model
      const modelSelect = page.locator("#model-select");
      const modelOptions = modelSelect.locator("option");
      const modelCount = await modelOptions.count();

      if (modelCount > 1) {
        const firstModel = await modelOptions.nth(1).getAttribute("value");
        await modelSelect.selectOption(firstModel!);

        const selectedValue = await modelSelect.evaluate(
          (el) => (el as HTMLSelectElement).value,
        );
        console.log("Selected model:", selectedValue);
        expect(selectedValue).toBe(firstModel);
      }
    }
  });

  test("should clear model when provider changes", async ({ page }) => {
    await page.waitForTimeout(2000);

    const providerSelect = page.locator("#provider-select");
    const modelSelect = page.locator("#model-select");

    // Selecionar provider e model
    const providerOptions = providerSelect.locator("option");
    const providerCount = await providerOptions.count();

    if (providerCount > 1) {
      const firstProvider = await providerOptions.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);
      await page.waitForTimeout(1000);

      const modelOptions = modelSelect.locator("option");
      const modelCount = await modelOptions.count();

      if (modelCount > 1) {
        const firstModel = await modelOptions.nth(1).getAttribute("value");
        await modelSelect.selectOption(firstModel!);

        // Trocar provider
        if (providerCount > 2) {
          const secondProvider = await providerOptions
            .nth(2)
            .getAttribute("value");
          await providerSelect.selectOption(secondProvider!);
          await page.waitForTimeout(1000);

          // Model deve ser resetado para a opção padrão
          const selectedModel = await modelSelect.evaluate(
            (el) => (el as HTMLSelectElement).value,
          );
          console.log("Model after provider change:", selectedModel);
          expect(selectedModel).toBe("");
        }
      }
    }
  });
});

import { test, expect } from "@playwright/test";
import { environment } from "../../environments/environment";

test.describe("Chat Provider Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      const text = msg.text();
      // Capturar erros relevantes
      if (text.includes("ERROR") || text.includes("provider") || text.includes("model")) {
        console.log(`CONSOLE [${msg.type()}]:`, text);
      }
    });
    
    page.on("response", (response) => {
      if (response.url().includes("providers") || response.url().includes("models")) {
        console.log(`RESPONSE: ${response.status()} - ${response.url()}`);
      }
    });

    await page.goto(environment.BASE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("should keep providers in select after selection and load models for selected provider", async ({ page }) => {
    // 1. Aguardar carregamento inicial
    await page.waitForTimeout(3000);
    
    const providerSelect = page.locator("#provider-select");
    const modelSelect = page.locator("#model-select");
    
    // 2. Verificar que os providers estão carregados
    const providerOptions = providerSelect.locator("option");
    const initialProviderCount = await providerOptions.count();
    console.log("Initial provider count:", initialProviderCount);
    
    expect(initialProviderCount).toBeGreaterThan(1);
    
    // 3. Obter o primeiro provider
    const firstProvider = await providerOptions.nth(1).getAttribute("value");
    console.log("First provider:", firstProvider);
    
    // 4. Clicar no select de provider - não deve sumir os providers
    await providerSelect.click();
    await page.waitForTimeout(500);
    
    // 5. Verificar que os providers ainda estão lá após clicar
    const providerCountAfterClick = await providerOptions.count();
    console.log("Provider count after click:", providerCountAfterClick);
    expect(providerCountAfterClick).toBe(initialProviderCount);
    
    // 6. Selecionar o primeiro provider
    await providerSelect.selectOption(firstProvider!);
    await page.waitForTimeout(2000);
    
    // 7. Verificar que os providers NÃO sumiram após seleção
    const providerCountAfterSelect = await providerOptions.count();
    console.log("Provider count after select:", providerCountAfterSelect);
    expect(providerCountAfterSelect).toBe(initialProviderCount);
    
    // 8. Verificar que os modelos foram carregados para o provider selecionado
    const modelOptions = modelSelect.locator("option");
    const modelCount = await modelOptions.count();
    console.log("Model count after provider select:", modelCount);
    expect(modelCount).toBeGreaterThan(1);
    
    // 9. Verificar que o provider permanece selecionado
    const selectedValue = await providerSelect.evaluate(
      (el) => (el as HTMLSelectElement).value,
    );
    expect(selectedValue).toBe(firstProvider);
  });

  test("should update models when changing to different provider", async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const providerSelect = page.locator("#provider-select");
    const modelSelect = page.locator("#model-select");
    
    // Obter os providers disponíveis
    const providerOptions = providerSelect.locator("option");
    const providerCount = await providerOptions.count();
    
    if (providerCount > 2) {
      // Selecionar primeiro provider
      const firstProvider = await providerOptions.nth(1).getAttribute("value");
      await providerSelect.selectOption(firstProvider!);
      await page.waitForTimeout(2000);
      
      // Obter modelos do primeiro provider
      const modelOptions1 = modelSelect.locator("option");
      const modelCount1 = await modelOptions1.count();
      console.log("Models for first provider:", modelCount1);
      
      // Trocar para segundo provider
      const secondProvider = await providerOptions.nth(2).getAttribute("value");
      await providerSelect.selectOption(secondProvider!);
      await page.waitForTimeout(2000);
      
      // Verificar que os models foram atualizados
      const modelOptions2 = modelSelect.locator("option");
      const modelCount2 = await modelOptions2.count();
      console.log("Models for second provider:", modelCount2);
      
      // ambos devem ter mais de 1 opção
      expect(modelCount1).toBeGreaterThan(1);
      expect(modelCount2).toBeGreaterThan(1);
      
      // Provider deve ter mudado
      const selectedProvider = await providerSelect.evaluate(
        (el) => (el as HTMLSelectElement).value,
      );
      expect(selectedProvider).toBe(secondProvider);
    }
  });

  test("should not lose providers when clicking on provider select multiple times", async ({ page }) => {
    await page.waitForTimeout(3000);
    
    const providerSelect = page.locator("#provider-select");
    const providerOptions = providerSelect.locator("option");
    
    // Contar providers iniciais
    const initialCount = await providerOptions.count();
    expect(initialCount).toBeGreaterThan(1);
    
    // Clicar e fechar o select 3 vezes
    for (let i = 0; i < 3; i++) {
      await providerSelect.click();
      await page.waitForTimeout(300);
      
      // Clicar em outro lugar para fechar
      await page.locator("body").click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);
      
      const currentCount = await providerOptions.count();
      console.log(`Click ${i + 1}: provider count = ${currentCount}`);
      expect(currentCount).toBe(initialCount);
    }
    
    // Verificar que ainda tem o mesmo número de providers
    const finalCount = await providerOptions.count();
    expect(finalCount).toBe(initialCount);
  });
});

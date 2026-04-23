import { IModuleLoader } from '../contracts/module-loader.contract';
import { DefaultConsoleAppFactory } from '../factories/default-console-app.factory';

describe('DefaultConsoleAppFactory', () => {
  it('creates an AIAssistantApp from the loaded module', async () => {
    const fakeAppInstance = { runConsoleApp() {}, processConsoleInput: async () => true };
    let loadedSpecifier = '';
    const moduleLoader: IModuleLoader = {
      load: async (specifier: string) => {
        loadedSpecifier = specifier;
        return {
          AIAssistantApp: class {
            constructor() {
              return fakeAppInstance;
            }
          },
        } as never;
      },
    };

    const app = await new DefaultConsoleAppFactory(moduleLoader).create();

    expect(app).toBe(fakeAppInstance as never);
    expect(loadedSpecifier).toBe('../../application/index.ts');
  });
});

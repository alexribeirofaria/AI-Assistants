import { ModuleLoaderService } from '../services/module-loader.service';

describe('ModuleLoaderService', () => {
  it('loads built-in node modules dynamically', async () => {
    const module = await new ModuleLoaderService().load<{ resolve: (value: unknown) => Promise<unknown> }>('node:path');

    expect(module).toBeDefined();
  });
});

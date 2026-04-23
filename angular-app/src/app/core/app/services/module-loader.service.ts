import { IModuleLoader } from '../contracts/module-loader.contract';

/* istanbul ignore next */
export class ModuleLoaderService implements IModuleLoader {
  async load<TModule>(specifier: string): Promise<TModule> {
    const dynamicImport = new Function('modulePath', 'return import(modulePath)') as (
      modulePath: string
    ) => Promise<TModule>;

    return dynamicImport(specifier);
  }
}

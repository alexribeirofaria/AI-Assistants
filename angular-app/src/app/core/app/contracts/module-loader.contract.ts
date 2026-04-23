export interface IModuleLoader {
  load<TModule>(specifier: string): Promise<TModule>;
}

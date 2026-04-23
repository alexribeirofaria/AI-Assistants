import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IConsoleAssistantApp } from '../contracts/console-app.contract';
import { IModuleLoader } from '../contracts/module-loader.contract';
import { ModuleLoaderService } from '../services/module-loader.service';

type ApplicationModule = {
  AIAssistantApp: new () => IConsoleAssistantApp;
};

/* istanbul ignore next */
export class DefaultConsoleAppFactory implements IConsoleAppFactory {
  constructor(private readonly moduleLoader: IModuleLoader = new ModuleLoaderService()) {}

  async create(): Promise<IConsoleAssistantApp> {
    const module = await this.moduleLoader.load<ApplicationModule>('../../application/index');
    return new module.AIAssistantApp();
  }
}

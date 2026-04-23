import { IInteractivePrompt } from '../contracts/interactive-prompt.contract';
import { IModuleLoader } from '../contracts/module-loader.contract';
import { IReadlineFactory } from '../contracts/prompt-factory.contract';
import { ModuleLoaderService } from '../services/module-loader.service';

type ReadlineModule = {
  createInterface: (options: unknown) => IInteractivePrompt;
};

type ProcessModule = {
  stdin: unknown;
  stdout: unknown;
};

/* istanbul ignore next */
export class NodeReadlineFactory implements IReadlineFactory {
  constructor(private readonly moduleLoader: IModuleLoader = new ModuleLoaderService()) {}

  async create(): Promise<IInteractivePrompt> {
    const [readlineModule, processModule] = await Promise.all([
      this.moduleLoader.load<ReadlineModule>('node:readline/promises'),
      this.moduleLoader.load<ProcessModule>('node:process'),
    ]);

    return readlineModule.createInterface({
      input: processModule.stdin,
      output: processModule.stdout,
    });
  }
}

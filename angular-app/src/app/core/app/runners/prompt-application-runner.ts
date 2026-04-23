import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { ConsoleBootstrapOptions } from '../contracts/console-bootstrap-options';
import { IReadlineFactory } from '../contracts/prompt-factory.contract';

export class PromptApplicationRunner {
  constructor(
    private readonly appFactory: IConsoleAppFactory,
    private readonly readlineFactory: IReadlineFactory
  ) {}

  async run(options: ConsoleBootstrapOptions): Promise<void> {
    if (options.mode !== 'prompt') {
      throw new Error(`Modo de execucao nao suportado: ${options.mode}`);
    }

    const app = await this.appFactory.create();
    app.runConsoleApp();

    const readline = await this.readlineFactory.create();

    try {
      while (true) {
        const userInput = await readline.question('> ');
        const shouldExit = await app.processConsoleInput(userInput);

        if (shouldExit) {
          break;
        }
      }
    } finally {
      readline.close();
    }
  }
}

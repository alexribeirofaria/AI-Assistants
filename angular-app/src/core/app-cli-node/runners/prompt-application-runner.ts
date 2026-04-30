import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IInteractivePrompt } from '../contracts/interactive-prompt.contract';

export class PromptApplicationRunner {
  constructor(
    private readonly appFactory: IConsoleAppFactory,
    private readonly prompt?: IInteractivePrompt
  ) {}

  async run(): Promise<void> {
    const app = await this.appFactory.create();
    app.runApp();

    const prompt = this.prompt ?? await this.createPrompt();

    try {
      while (true) {
        const userInput = await prompt.question(app.getInputPrompt());
        const shouldExit = await app.processInput(userInput);

        if (shouldExit) {
          break;
        }
      }
    } finally {
      prompt.close();
    }
  }

  private async createPrompt(): Promise<IInteractivePrompt> {
    const dynamicImport = new Function(
      'moduleSpecifier',
      'return import(moduleSpecifier);'
    ) as <TModule>(moduleSpecifier: string) => Promise<TModule>;

    const [readlineModule, processModule] = await Promise.all([
      dynamicImport<{
        createInterface: (options: { input: unknown; output: unknown }) => IInteractivePrompt;
      }>('node:readline/promises'),
      dynamicImport<{ stdin: unknown; stdout: unknown }>('node:process'),
    ]);

    return readlineModule.createInterface({
      input: processModule.stdin,
      output: processModule.stdout,
    });
  }
}

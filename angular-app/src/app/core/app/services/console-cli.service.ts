import { MainDependencies } from '../contracts/main-dependencies.contract';
import { DefaultConsoleAppFactory } from '../factories/default-console-app.factory';
import { NodeReadlineFactory } from '../factories/node-readline.factory';
import { ConsoleOptionsParser } from '../parsers/console-options-parser';
import { PromptApplicationRunner } from '../runners/prompt-application-runner';
import { toErrorMessage } from '../utils/error-message.util';
import { DefaultConsoleOutputService } from './default-console-output.service';
import { DefaultRuntimeService } from './default-runtime.service';

export class ConsoleCliService {
  async main(argv: string[], dependencies: MainDependencies = {}): Promise<void> {
    const output = dependencies.output ?? new DefaultConsoleOutputService();
    const parser = new ConsoleOptionsParser(output);
    const options = parser.parse(argv);

    if (options.shouldExit) {
      return;
    }

    const runner = new PromptApplicationRunner(
      dependencies.appFactory ?? new DefaultConsoleAppFactory(),
      dependencies.promptFactory ?? new NodeReadlineFactory()
    );

    await runner.run(options);
  }

  async execute(dependencies: MainDependencies = {}): Promise<void> {
    const runtime = dependencies.runtime ?? new DefaultRuntimeService();
    const output = dependencies.output ?? new DefaultConsoleOutputService();

    try {
      await this.main(runtime.argv, {
        ...dependencies,
        output,
        runtime,
      });
    } catch (error: unknown) {
      output.writeError(`[ERROR] ${toErrorMessage(error)}\n`);
      runtime.setExitCode(1);
    }
  }
}

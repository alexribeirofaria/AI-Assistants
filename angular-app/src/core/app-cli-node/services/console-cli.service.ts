import { MainDependencies } from '../contracts/main-dependencies.contract';
import { DefaultConsoleAppFactory } from '../factories/default-console-app.factory';
import { PromptApplicationRunner } from '../runners/prompt-application-runner';
import { toErrorMessage } from '../utils/error-message.util';
import { DefaultConsoleOutputService } from './default-console-output.service';
import { DefaultRuntimeService } from './default-runtime.service';

export class ConsoleCliService {
  async main(dependencies: MainDependencies = {}): Promise<void> {
    const runner = new PromptApplicationRunner(
      dependencies.appFactory ?? new DefaultConsoleAppFactory(),
      dependencies.prompt
    );

    await runner.run();
  }

  async execute(dependencies: MainDependencies = {}): Promise<void> {
    const runtime = dependencies.runtime ?? new DefaultRuntimeService();
    const output = dependencies.output ?? new DefaultConsoleOutputService();

    try {
      await this.main({
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

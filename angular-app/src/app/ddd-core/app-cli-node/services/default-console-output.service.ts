import { IConsoleOutput } from '../contracts/console-output.contract';
import { ConsoleProcess, ConsoleProcessHost } from '../contracts/console-process.contract';

/* istanbul ignore next */
export class DefaultConsoleOutputService implements IConsoleOutput {
  write(content: string): void {
    this.getProcess()?.stdout?.write(content);
  }

  writeError(content: string): void {
    this.getProcess()?.stderr?.write(content);
  }

  private getProcess(): ConsoleProcess | null {
    const host = globalThis as ConsoleProcessHost;
    return host.process ?? null;
  }
}

import { IConsoleOutput } from '../contracts/console-output.contract';

type ProcessWriter = { write(content: string): void };

type ProcessRef = {
  stdout?: ProcessWriter;
  stderr?: ProcessWriter;
};

/* istanbul ignore next */
export class DefaultConsoleOutputService implements IConsoleOutput {
  write(content: string): void {
    this.getProcess()?.stdout?.write(content);
  }

  writeError(content: string): void {
    this.getProcess()?.stderr?.write(content);
  }

  private getProcess(): ProcessRef | null {
    const host = globalThis as typeof globalThis & { process?: ProcessRef };
    return host.process ?? null;
  }
}

import { IRuntime } from '../contracts/runtime.contract';

type RuntimeProcess = {
  argv?: string[];
  exitCode?: number;
};

/* istanbul ignore next */
export class DefaultRuntimeService implements IRuntime {
  get argv(): string[] {
    return this.getProcess()?.argv?.slice(2) ?? [];
  }

  get isCliEnvironment(): boolean {
    return typeof window === 'undefined' && this.getProcess() !== null;
  }

  setExitCode(code: number): void {
    const processRef = this.getProcess();
    if (processRef) {
      processRef.exitCode = code;
    }
  }

  private getProcess(): RuntimeProcess | null {
    const host = globalThis as typeof globalThis & { process?: RuntimeProcess };
    return host.process ?? null;
  }
}

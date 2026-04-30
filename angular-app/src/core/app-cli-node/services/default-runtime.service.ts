import { IRuntime } from '../contracts/runtime.contract';
import { RuntimeProcess, RuntimeProcessHost } from '../contracts/runtime-process.contract';

/* istanbul ignore next */
export class DefaultRuntimeService implements IRuntime {
  get isCliEnvironment(): boolean {
    return this.getProcess() !== null;
  }

  setExitCode(code: number): void {
    const processRef = this.getProcess();
    if (processRef) {
      processRef.exitCode = code;
    }
  }

  private getProcess(): RuntimeProcess | null {
    const host = globalThis as RuntimeProcessHost;
    return host.process ?? null;
  }
}

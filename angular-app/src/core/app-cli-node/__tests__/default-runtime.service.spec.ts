import { RuntimeProcess, RuntimeProcessHost } from '../contracts/runtime-process.contract';
import { DefaultRuntimeService } from '../services/default-runtime.service';

describe('DefaultRuntimeService', () => {
  const host = globalThis as RuntimeProcessHost;
  const originalProcess = host.process;

  afterEach(() => {
    Object.defineProperty(host, 'process', {
      configurable: true,
      writable: true,
      value: originalProcess,
    });
  });

  it('writes exitCode from global process and detects cli environment', () => {
    const fakeProcess: RuntimeProcess = { exitCode: 0 };
    Object.defineProperty(host, 'process', {
      configurable: true,
      writable: true,
      value: fakeProcess,
    });

    const runtime = new DefaultRuntimeService();
    runtime.setExitCode(2);

    expect(runtime.isCliEnvironment).toBeTrue();
    expect(fakeProcess.exitCode).toBe(2);
  });
});

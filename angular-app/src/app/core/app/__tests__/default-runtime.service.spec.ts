import { DefaultRuntimeService } from '../services/default-runtime.service';

describe('DefaultRuntimeService', () => {
  const originalProcess = (globalThis as typeof globalThis & { process?: unknown }).process;

  afterEach(() => {
    (globalThis as typeof globalThis & { process?: unknown }).process = originalProcess;
  });

  it('reads argv and writes exitCode from global process', () => {
    const fakeProcess = { argv: ['node', 'app', '--help'], exitCode: 0 };
    (globalThis as typeof globalThis & { process?: unknown }).process = fakeProcess;

    const runtime = new DefaultRuntimeService();
    runtime.setExitCode(2);

    expect(runtime.argv).toEqual(['--help']);
    expect(fakeProcess.exitCode).toBe(2);
  });
});

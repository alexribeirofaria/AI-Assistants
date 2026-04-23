import { DefaultConsoleOutputService } from '../services/default-console-output.service';

describe('DefaultConsoleOutputService', () => {
  const originalProcess = (globalThis as typeof globalThis & { process?: unknown }).process;

  afterEach(() => {
    (globalThis as typeof globalThis & { process?: unknown }).process = originalProcess;
  });

  it('writes to stdout and stderr when process is available', () => {
    const stdoutWrite = jasmine.createSpy('stdoutWrite');
    const stderrWrite = jasmine.createSpy('stderrWrite');
    (globalThis as typeof globalThis & { process?: unknown }).process = {
      stdout: { write: stdoutWrite },
      stderr: { write: stderrWrite },
    };

    const output = new DefaultConsoleOutputService();
    output.write('ok');
    output.writeError('fail');

    expect(stdoutWrite).toHaveBeenCalledWith('ok');
    expect(stderrWrite).toHaveBeenCalledWith('fail');
  });
});

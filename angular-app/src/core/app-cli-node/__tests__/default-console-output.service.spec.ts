import { ConsoleProcess, ConsoleProcessHost } from '../contracts/console-process.contract';
import { DefaultConsoleOutputService } from '../services/default-console-output.service';

describe('DefaultConsoleOutputService', () => {
  const host = globalThis as ConsoleProcessHost;
  const originalProcess = host.process;

  afterEach(() => {
    Object.defineProperty(host, 'process', {
      configurable: true,
      writable: true,
      value: originalProcess,
    });
  });

  it('writes to stdout and stderr when process is available', () => {
    const stdoutWrite = jasmine.createSpy('stdoutWrite');
    const stderrWrite = jasmine.createSpy('stderrWrite');
    const fakeProcess: ConsoleProcess = {
      stdout: { write: stdoutWrite },
      stderr: { write: stderrWrite },
    };

    Object.defineProperty(host, 'process', {
      configurable: true,
      writable: true,
      value: fakeProcess,
    });

    const output = new DefaultConsoleOutputService();
    output.write('ok');
    output.writeError('fail');

    expect(stdoutWrite).toHaveBeenCalledWith('ok');
    expect(stderrWrite).toHaveBeenCalledWith('fail');
  });
});

import { IConsoleOutput } from '../contracts/console-output.contract';
import { ConsoleOptionsParser } from '../parsers/console-options-parser';

class FakeOutput implements IConsoleOutput {
  readonly writes: string[] = [];
  readonly errors: string[] = [];

  write(content: string): void {
    this.writes.push(content);
  }

  writeError(content: string): void {
    this.errors.push(content);
  }
}

describe('ConsoleOptionsParser', () => {
  it('prints help and exits when receives --help', () => {
    const output = new FakeOutput();
    const parser = new ConsoleOptionsParser(output);

    const result = parser.parse(['--help']);

    expect(result).toEqual({ mode: 'prompt', shouldExit: true });
    expect(output.writes.join('')).toContain('Uso: npm run prompt');
  });

  it('rejects unsupported app modes', () => {
    const parser = new ConsoleOptionsParser(new FakeOutput());

    expect(() => parser.parse(['--app', 'web'])).toThrowError(
      'Somente o modo prompt e suportado. O modo web foi removido deste entry point.'
    );
  });

  it('rejects missing app mode values', () => {
    const parser = new ConsoleOptionsParser(new FakeOutput());

    expect(() => parser.parse(['--app'])).toThrowError(
      'Informe um valor para --app. Use --app prompt.'
    );
  });
});

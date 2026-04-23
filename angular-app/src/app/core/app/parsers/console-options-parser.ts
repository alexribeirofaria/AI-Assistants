import { ConsoleBootstrapOptions } from '../contracts/console-bootstrap-options';
import { IConsoleOutput } from '../contracts/console-output.contract';

export class ConsoleOptionsParser {
  constructor(private readonly output: IConsoleOutput) {}

  parse(argv: string[]): ConsoleBootstrapOptions {
    if (argv.includes('--help') || argv.includes('-h')) {
      this.printUsage();
      return { mode: 'prompt', shouldExit: true };
    }

    const appFlagIndex = argv.indexOf('--app');
    if (appFlagIndex === -1) {
      return { mode: 'prompt', shouldExit: false };
    }

    const requestedMode = argv[appFlagIndex + 1];
    if (!requestedMode) {
      throw new Error('Informe um valor para --app. Use --app prompt.');
    }

    if (requestedMode !== 'prompt') {
      throw new Error('Somente o modo prompt e suportado. O modo web foi removido deste entry point.');
    }

    return { mode: 'prompt', shouldExit: false };
  }

  private printUsage(): void {
    this.output.write([
      'Uso: npm run prompt',
      'Uso alternativo: npm run prompt -- --app prompt',
      'Somente o modo prompt esta disponivel neste arquivo.',
      '',
    ].join('\n'));
  }
}

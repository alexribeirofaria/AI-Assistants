import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IConsoleAssistantApp } from '../contracts/console-app.contract';
import { IConsoleOutput } from '../contracts/console-output.contract';
import { IInteractivePrompt } from '../contracts/interactive-prompt.contract';
import { IReadlineFactory } from '../contracts/prompt-factory.contract';
import { IRuntime } from '../contracts/runtime.contract';
import { ConsoleCliService } from '../services/console-cli.service';

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

class FakePrompt implements IInteractivePrompt {
  closed = false;

  constructor(private readonly answers: string[]) {}

  async question(_prompt: string): Promise<string> {
    return this.answers.shift() ?? '';
  }

  close(): void {
    this.closed = true;
  }
}

class FakePromptFactory implements IReadlineFactory {
  constructor(private readonly prompt: IInteractivePrompt) {}

  create(): IInteractivePrompt {
    return this.prompt;
  }
}

class FakeApp implements IConsoleAssistantApp {
  constructor(private readonly shouldExit: boolean = true) {}

  runConsoleApp(): void {}

  async processConsoleInput(_input: string): Promise<boolean> {
    return this.shouldExit;
  }
}

class FakeAppFactory implements IConsoleAppFactory {
  createCalls = 0;

  constructor(private readonly app: IConsoleAssistantApp) {}

  create(): IConsoleAssistantApp {
    this.createCalls += 1;
    return this.app;
  }
}

class FakeRuntime implements IRuntime {
  exitCode: number | null = null;

  constructor(
    public readonly argv: string[],
    public readonly isCliEnvironment: boolean = false
  ) {}

  setExitCode(code: number): void {
    this.exitCode = code;
  }
}

describe('ConsoleCliService', () => {
  it('does not initialize the app when help is requested', async () => {
    const output = new FakeOutput();
    const appFactory = new FakeAppFactory(new FakeApp());

    await new ConsoleCliService().main(['--help'], {
      output,
      appFactory,
      promptFactory: new FakePromptFactory(new FakePrompt([])),
    });

    expect(output.writes.join('')).toContain('Somente o modo prompt');
    expect(appFactory.createCalls).toBe(0);
  });

  it('runs the prompt application in prompt mode', async () => {
    const appFactory = new FakeAppFactory(new FakeApp());

    await new ConsoleCliService().main([], {
      output: new FakeOutput(),
      appFactory,
      promptFactory: new FakePromptFactory(new FakePrompt(['exit'])),
    });

    expect(appFactory.createCalls).toBe(1);
  });

  it('writes the error and sets exit code when execution fails', async () => {
    const output = new FakeOutput();
    const runtime = new FakeRuntime(['--app', 'web']);

    await new ConsoleCliService().execute({ output, runtime });

    expect(output.errors).toEqual([
      '[ERROR] Somente o modo prompt e suportado. O modo web foi removido deste entry point.\n',
    ]);
    expect(runtime.exitCode).toBe(1);
  });

  it('converts non-primitive thrown errors into readable messages', async () => {
    const output = new FakeOutput();
    const runtime = new FakeRuntime([]);
    const circular: { self?: unknown } = {};
    circular.self = circular;

    await new ConsoleCliService().execute({
      output,
      runtime,
      appFactory: {
        create: () => {
          throw circular;
        },
      },
      promptFactory: new FakePromptFactory(new FakePrompt([])),
    });

    expect(output.errors[0]).toContain('[ERROR] ');
    expect(runtime.exitCode).toBe(1);
  });
});

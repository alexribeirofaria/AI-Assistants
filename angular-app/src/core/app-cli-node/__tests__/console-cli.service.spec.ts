import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IConsoleAssistantApp } from '../contracts/console-app.contract';
import { IConsoleOutput } from '../contracts/console-output.contract';
import { IInteractivePrompt } from '../contracts/interactive-prompt.contract';
import { IRuntime } from '../contracts/runtime.contract';
import { ConsoleCliService } from '../services/console-cli.service';
import { PromptApplicationRunner } from '../runners/prompt-application-runner';

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

class FakeApp implements IConsoleAssistantApp {
  constructor(private readonly shouldExit: boolean = true) {}

  runApp(): void {}

  getInputPrompt(): string {
    return '[Test(model)] > ';
  }

  async processInput(_input: string): Promise<boolean> {
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

  constructor(public readonly isCliEnvironment: boolean = false) {}

  setExitCode(code: number): void {
    this.exitCode = code;
  }
}

describe('ConsoleCliService', () => {
  it('runs the prompt application in prompt mode', async () => {
    const appFactory = new FakeAppFactory(new FakeApp());

    await new ConsoleCliService().main({
      output: new FakeOutput(),
      appFactory,
      prompt: new FakePrompt(['exit']),
    });

    expect(appFactory.createCalls).toBe(1);
  });

  it('creates and runs the prompt runner when main is called without dependencies', async () => {
    spyOn(PromptApplicationRunner.prototype, 'run').and.resolveTo();

    await new ConsoleCliService().main();

    expect(PromptApplicationRunner.prototype.run).toHaveBeenCalled();
  });

  it('writes the error and sets exit code when execution fails', async () => {
    const output = new FakeOutput();
    const runtime = new FakeRuntime();

    await new ConsoleCliService().execute({
      output,
      runtime,
      appFactory: {
        create: () => {
          throw new Error('falha no console');
        },
      },
      prompt: new FakePrompt([]),
    });

    expect(output.errors).toEqual([
      '[ERROR] falha no console\n',
    ]);
    expect(runtime.exitCode).toBe(1);
  });

  it('converts non-primitive thrown errors into readable messages', async () => {
    const output = new FakeOutput();
    const runtime = new FakeRuntime();
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
      prompt: new FakePrompt([]),
    });

    expect(output.errors[0]).toContain('[ERROR] ');
    expect(runtime.exitCode).toBe(1);
  });

  it('delegates to main with resolved runtime/output dependencies on success', async () => {
    const service = new ConsoleCliService();
    const runtime = new FakeRuntime();
    const output = new FakeOutput();
    spyOn(service, 'main').and.resolveTo();

    await service.execute({ runtime, output });

    expect(service.main).toHaveBeenCalled();
    const args = (service.main as jasmine.Spy).calls.mostRecent().args[0];
    expect(args.runtime).toBe(runtime);
    expect(args.output).toBe(output);
    expect(runtime.exitCode).toBeNull();
  });
});

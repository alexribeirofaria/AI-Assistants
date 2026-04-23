import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IConsoleAssistantApp } from '../contracts/console-app.contract';
import { IInteractivePrompt } from '../contracts/interactive-prompt.contract';
import { IReadlineFactory } from '../contracts/prompt-factory.contract';
import { PromptApplicationRunner } from '../runners/prompt-application-runner';

class FakePrompt implements IInteractivePrompt {
  private index = 0;
  closed = false;
  readonly prompts: string[] = [];

  constructor(private readonly answers: string[]) {}

  async question(prompt: string): Promise<string> {
    this.prompts.push(prompt);
    const answer = this.answers[this.index] ?? '';
    this.index += 1;
    return answer;
  }

  close(): void {
    this.closed = true;
  }
}

class FakePromptFactory implements IReadlineFactory {
  constructor(private readonly prompt: FakePrompt) {}

  create(): IInteractivePrompt {
    return this.prompt;
  }
}

class FakeApp implements IConsoleAssistantApp {
  readonly processedInputs: string[] = [];
  runConsoleAppCalls = 0;

  constructor(private readonly exitOnInput: string) {}

  runConsoleApp(): void {
    this.runConsoleAppCalls += 1;
  }

  async processConsoleInput(input: string): Promise<boolean> {
    this.processedInputs.push(input);
    return input === this.exitOnInput;
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

describe('PromptApplicationRunner', () => {
  it('processes inputs until the application requests exit', async () => {
    const app = new FakeApp('sair');
    const prompt = new FakePrompt(['ola', 'sair']);
    const runner = new PromptApplicationRunner(
      new FakeAppFactory(app),
      new FakePromptFactory(prompt)
    );

    await runner.run({ mode: 'prompt', shouldExit: false });

    expect(app.runConsoleAppCalls).toBe(1);
    expect(app.processedInputs).toEqual(['ola', 'sair']);
    expect(prompt.prompts).toEqual(['> ', '> ']);
    expect(prompt.closed).toBeTrue();
  });

  it('rejects unsupported execution modes', async () => {
    const runner = new PromptApplicationRunner(
      new FakeAppFactory(new FakeApp('exit')),
      new FakePromptFactory(new FakePrompt([]))
    );

    await expectAsync(
      runner.run({ mode: 'invalid' as never, shouldExit: false })
    ).toBeRejectedWithError('Modo de execucao nao suportado: invalid');
  });
});

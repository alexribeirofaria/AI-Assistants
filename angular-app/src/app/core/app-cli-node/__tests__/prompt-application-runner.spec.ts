import { IConsoleAppFactory } from '../contracts/console-app-factory.contract';
import { IConsoleAssistantApp } from '../contracts/console-app.contract';
import { IInteractivePrompt } from '../contracts/interactive-prompt.contract';
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

class FakeApp implements IConsoleAssistantApp {
  readonly processedInputs: string[] = [];
  runConsoleAppCalls = 0;

  constructor(private readonly exitOnInput: string) {}

  runApp(): void {
    this.runConsoleAppCalls += 1;
  }

  getInputPrompt(): string {
    return '[Test(model)] > ';
  }

  async processInput(input: string): Promise<boolean> {
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
      prompt
    );

    await runner.run();

    expect(app.runConsoleAppCalls).toBe(1);
    expect(app.processedInputs).toEqual(['ola', 'sair']);
    expect(prompt.prompts).toEqual(['[Test(model)] > ', '[Test(model)] > ']);
    expect(prompt.closed).toBeTrue();
  });

  it('uses createPrompt when no prompt is provided', async () => {
    const app = new FakeApp('bye');
    const prompt = new FakePrompt(['bye']);
    const runner = new PromptApplicationRunner(new FakeAppFactory(app));
    spyOn<any>(runner, 'createPrompt').and.resolveTo(prompt);

    await runner.run();

    expect(app.processedInputs).toEqual(['bye']);
    expect(prompt.closed).toBeTrue();
    expect((runner as any).createPrompt).toHaveBeenCalled();
  });

  it('always closes the prompt even when processInput throws', async () => {
    const prompt = new FakePrompt(['boom']);
    const app = {
      getInputPrompt: jasmine.createSpy('getInputPrompt').and.returnValue('[Test(model)] > '),
      runApp: jasmine.createSpy('runApp'),
      processInput: jasmine.createSpy('processInput').and.rejectWith(new Error('failure')),
    } as unknown as IConsoleAssistantApp;
    const runner = new PromptApplicationRunner(new FakeAppFactory(app), prompt);

    await expectAsync(runner.run()).toBeRejectedWithError('failure');
    expect(prompt.closed).toBeTrue();
  });
});

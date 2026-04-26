import { fakeAsync, tick } from '@angular/core/testing';
import { StrategyApplicationFactory } from '../../application/strategies/factories/strategy-application-factory';
import { OpenAI } from '../../domain/openai-domain';
import { OutputPresenter } from '../../presentation';
import { AIAssistantApp } from '../ai-assistant-app';
import { UserAction } from '../enums/user-action';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';

describe('AIAssistantApp', () => {
  const mockServer = {
    chat: { completions: { create: jasmine.createSpy('create') } },
    models: { list: jasmine.createSpy('list').and.returnValue({ data: [] }) },
  } as never;

  class TestDomain extends OpenAI {
    constructor() {
      super(mockServer, 'test');
    }

    static override getDomainName(): string {
      return 'Test';
    }
  }

  class TestStrategy extends BaseApplicationStrategy {
    private currentModel = 'm1';

    constructor() {
      super(TestDomain);
    }

    override useModel(model: string | undefined): void {
      if (model?.trim()) {
        this.currentModel = model;
      }
    }

    override getCurrentModel(): string {
      return this.currentModel;
    }

    override async execute(task: string): Promise<string> {
      return `done:${this.getCurrentModel()}:${task}`;
    }

    override async listDomains() {
      return { header: 'header', names: ['m1', 'm2'], prefix: '> ' };
    }
  }

  class TestFactory extends StrategyApplicationFactory {
    constructor() {
      super({ TestDomain: () => new TestStrategy() } as never, 'TestDomain');
    }
  }

  let presenter: jasmine.SpyObj<OutputPresenter>;
  let app: AIAssistantApp;

  beforeEach(() => {
    presenter = jasmine.createSpyObj<OutputPresenter>('OutputPresenter', ['showUI', 'showGoodbye', 'showModelSwitched', 'showModelList', 'showWarning', 'showResponse', 'showElapsedTime', 'clearElapsedTime']);
    app = new AIAssistantApp(new TestFactory(), presenter);
  });

  it('filters models by prefix and search query', async () => {
    await expectAsync(app.listModels('TestDomain', undefined, 'm1')).toBeResolvedTo({
      defaultModel: 'm1',
      models: [{ id: 'm1', modelName: 'm1', provider: 'Test' }],
    });

    await expectAsync(app.listModels('TestDomain', '2')).toBeResolvedTo({
      defaultModel: 'm2',
      models: [{ id: 'm2', modelName: 'm2', provider: 'Test' }],
    });
  });

  it('exposes providers, models and the current default model for the chat gateway flow', async () => {
    const providers = await app.getProviders();
    expect(providers).toContain('Test');
    expect(await app.listModels('test')).toEqual({
      defaultModel: 'm1',
      models: [
        { id: 'm1', modelName: 'm1', provider: 'Test' },
        { id: 'm2', modelName: 'm2', provider: 'Test' },
      ],
    });
    expect(await app.getDefaultModel('test')).toBe('m1');

    app.selectModel('m2');
    expect(await app.getDefaultModel('test')).toBe('m2');
  });

  it('changes provider and sends messages using the selected model', async () => {
    await expectAsync(app.changeProvider('test')).toBeResolvedTo({ status: 'ok' });

    app.selectModel('m2');
    await expectAsync(app.sendMessage('hello')).toBeResolvedTo({
      input: 'hello',
      response: {
        model: 'm2',
        response: 'done:m2:hello',
      },
    });
  });

  it('switches models, clears the UI and exits cleanly', async () => {
    expect(await app._handleAction('switch_model', TestDomain)).toBeFalse();
    expect(presenter.showModelSwitched).toHaveBeenCalledWith('Test');

    expect(await app._handleAction('clear', null)).toBeFalse();
    expect(presenter.showUI).toHaveBeenCalled();

    expect(await app._handleAction('exit', null)).toBeTrue();
    expect(presenter.showGoodbye).toHaveBeenCalled();
  });

  it('handles invalid switches, list models and message queueing', fakeAsync(() => {
    void app._handleAction('switch_model', 'missing').then((result) => {
      expect(result).toBeFalse();
      expect(presenter.showWarning).toHaveBeenCalled();
    });

    void app._handleAction('message', 'queued');
    tick(0);
    expect(presenter.showResponse).toBeDefined();
  }));

  it('queues message tasks without changing the active strategy', fakeAsync(() => {
    void app._handleAction(UserAction.MESSAGE, 'queued').then((result) => {
      expect(result).toBeFalse();
    });
    expect(app.defaultModelAgent).toBe('TestDomain');
    tick(0);
    expect(presenter.showResponse).toHaveBeenCalledWith('Test', 'done:m1:queued');
  }));

  it('runs the console app and respects explicit actions', async () => {
    app.runApp();
    expect(presenter.showUI).toHaveBeenCalled();

    expect(await app._handleAction(UserAction.LIST_MODELS, TestDomain)).toBeFalse();
  });
});

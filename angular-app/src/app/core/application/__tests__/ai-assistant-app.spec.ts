import { OutputPresenter } from '../../presentation';
import { StrategyApplicationFactory } from '../../application/strategies/factories/strategy-application-factory';
import { AIAssistantApp } from '../ai-assistant-app';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';
import { OpenAIDomain } from '../../domain/openai-domain';
import { fakeAsync, tick } from '@angular/core/testing';
import { UserAction } from '../enums/user-action';

describe('AIAssistantApp', () => {
  const mockServer = {
    chat: { completions: { create: jasmine.createSpy('create') } },
    models: { list: jasmine.createSpy('list').and.returnValue({ data: [] }) },
  } as never;

  class TestDomain extends OpenAIDomain {
    constructor() {
      super(mockServer, 'test');
    }

    static override getDomainName(): string {
      return 'Test';
    }
  }

  class TestStrategy extends BaseApplicationStrategy {
    constructor() {
      super(TestDomain);
    }

    override async execute(task: string): Promise<string> {
      return `done:${task}`;
    }

    override listDomains() {
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

  it('returns model lists and runs message prompts', async () => {
    const list = app.listModels(undefined, undefined, 'TestDomain');
    expect(list).toEqual(['m1', 'm2']);

    const result = app.runWebApp('hello');
    expect(await result.response).toBe('done:hello');
  });

  it('filters models by prefix and search query', () => {
    expect(app.listModels(undefined, 'm1', 'TestDomain')).toEqual(['m1']);
    expect(app.listModels('2', undefined, 'TestDomain')).toEqual(['m2']);
  });

  it('returns the list models view and switches the active model through runWebApp', () => {
    const listResult = app.runWebApp('list models');
    expect(listResult).toEqual({ header: 'header', names: ['m1', 'm2'], prefix: '> ' });

    expect(app._handleAction('switch_model', TestDomain)).toBeFalse();
    expect(presenter.showModelSwitched).toHaveBeenCalledWith('Test');
  });

  it('switches models, clears the UI and exits cleanly', () => {
    expect(app._handleAction('switch_model', TestDomain)).toBeFalse();
    expect(presenter.showModelSwitched).toHaveBeenCalledWith('Test');

    expect(app._handleAction('clear', null)).toBeFalse();
    expect(presenter.showUI).toHaveBeenCalled();

    expect(app._handleAction('exit', null)).toBeTrue();
    expect(presenter.showGoodbye).toHaveBeenCalled();
  });

  it('handles invalid switches, list models and message queueing', fakeAsync(() => {
    expect(app._handleAction('switch_model', 'missing')).toBeFalse();
    expect(presenter.showWarning).toHaveBeenCalled();

    const listResult = app.runWebApp('list models');
    expect(listResult.header).toBe('header');

    app._handleAction('message', 'queued');
    tick(0);
    expect(presenter.showResponse).toBeDefined();
  }));

  it('queues message tasks without changing the active strategy', fakeAsync(() => {
    expect(app._handleAction(UserAction.MESSAGE, 'queued')).toBeFalse();
    expect(app.defaultModelAgent).toBe('TestDomain');
    tick(0);
    expect(presenter.showResponse).toHaveBeenCalledWith('TestDomain', 'done:queued');
  }));

  it('runs the console app and respects explicit actions', () => {
    app.runConsoleApp();
    expect(presenter.showUI).toHaveBeenCalled();

    expect(app._handleAction(UserAction.LIST_MODELS, TestDomain)).toBeFalse();
  });
});

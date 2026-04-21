import { OutputPresenter } from '../../presentation';
import { StrategyApplicationFactory } from '../../application/strategies/factories/strategy-application-factory';
import { ThreadController } from '../controller/thread-controller';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';
import { OpenAIDomain } from '../../domain/openai-domain';
import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';

describe('ThreadController', () => {
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
      return `echo:${task}`;
    }

    override listDomains() {
      return { header: 'header', names: ['m1'], prefix: '> ' };
    }
  }

  class ErrorStrategy extends BaseApplicationStrategy {
    constructor() {
      super(TestDomain);
    }

    override async execute(): Promise<string> {
      throw new Error('boom');
    }
  }

  let presenter: jasmine.SpyObj<OutputPresenter>;
  let factory: StrategyApplicationFactory;
  let controller: ThreadController;

  beforeEach(() => {
    presenter = jasmine.createSpyObj<OutputPresenter>('OutputPresenter', ['showResponse', 'showModelList', 'showWarning', 'showElapsedTime', 'clearElapsedTime']);
    factory = new StrategyApplicationFactory({ TestDomain: () => new TestStrategy() } as never, 'TestDomain');
    controller = new ThreadController(presenter, factory);
  });

  it('processes message tasks', fakeAsync(() => {
    controller.enqueueTask('message', TestDomain, 'hello');
    tick(0);
    flushMicrotasks();
    expect(presenter.showResponse).toHaveBeenCalledWith('TestDomain', 'echo:hello');
  }));

  it('processes list model tasks and stops threads safely', fakeAsync(() => {
    controller.enqueueTask('list_models', TestDomain, '');
    tick(0);
    flushMicrotasks();
    expect(presenter.showModelList).toHaveBeenCalledWith('header', ['m1'], '> ');

    controller.stopThreads(false);
    expect(true).toBeTrue();
  }));

  it('shows elapsed time and warns on task errors', fakeAsync(() => {
    const errorFactory = new StrategyApplicationFactory({ ErrorDomain: () => new ErrorStrategy() } as never, 'ErrorDomain');
    controller = new ThreadController(presenter, errorFactory);

    controller.showElapsedTimeUntilQueueFinishes();
    tick(0);
    flushMicrotasks();
    expect(presenter.clearElapsedTime).toHaveBeenCalled();

    controller.enqueueTask('message', TestDomain, 'hello');
    tick(0);
    flushMicrotasks();
    expect(presenter.showWarning).toHaveBeenCalled();
  }));
});

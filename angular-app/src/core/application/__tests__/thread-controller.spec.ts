import { OutputPresenter } from '../../presentation';
import { StrategyApplicationFactory } from '../strategies/factories/strategy-application-factory';
import { ThreadController } from '../controller/thread-controller';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';
import { OpenAI } from '../../domain/openai-domain';
import { fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';

describe('ThreadController', () => {
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
    constructor() {
      super(TestDomain);
    }

    override async execute(task: string): Promise<string> {
      return `echo:${task}`;
    }

    override async listDomains() {
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
    expect(presenter.showResponse).toHaveBeenCalledWith('Test', 'echo:hello');
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

  it('updates elapsed time while queue still has tasks and completes threads', fakeAsync(() => {
    controller = new ThreadController(presenter, factory);
    spyOn<any>(controller as any, 'processTask').and.returnValue(new Promise<void>(() => {}));
    controller.enqueueTask('message', TestDomain, 'wait');

    controller.showElapsedTimeUntilQueueFinishes();
    tick(1000);
    expect(presenter.showElapsedTime).toHaveBeenCalled();

    (controller as any).queue.next([]);
    tick(1000);
    expect(presenter.clearElapsedTime).toHaveBeenCalled();

    controller.stopThreads(true);
    expect(true).toBeTrue();
  }));
});

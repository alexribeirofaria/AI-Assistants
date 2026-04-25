import { OutputPresenter } from '../../presentation';
import { AIAssistantApp } from '../ai-assistant-app';
import { UserAction } from '../enums/user-action';

describe('AIAssistantApp Branch Unit Tests', () => {
  const createApp = (overrides?: Partial<any>) => {
    const strategy = {
      domainClass: { getDomainName: () => 'OpenAI' },
      useModel: jasmine.createSpy('useModel'),
      getCurrentModel: jasmine.createSpy('getCurrentModel').and.returnValue('gpt-4o-mini'),
      execute: jasmine.createSpy('execute').and.resolveTo('ok'),
      listDomains: jasmine.createSpy('listDomains').and.resolveTo({
        header: 'header',
        names: ['gpt-4o-mini', 'gpt-4o'],
        prefix: '',
      }),
      ...overrides?.['strategy'],
    };

    const OpenAICtor = function OpenAI(): void {} as any;
    OpenAICtor.getDomainName = () => 'OpenAI';
    const GroqCtor = function Groq(): void {} as any;
    GroqCtor.getDomainName = () => 'Groq';

    const factory = {
      defaultDomain: 'OpenAI',
      available: jasmine.createSpy('available').and.returnValue([OpenAICtor, GroqCtor]),
      availableDomainKeys: jasmine.createSpy('availableDomainKeys').and.returnValue(['OpenAI', 'Groq']),
      getStrategy: jasmine.createSpy('getStrategy').and.returnValue(strategy),
      getDomainKey: jasmine.createSpy('getDomainKey').and.callFake((value: any) => {
        if (value === 'openai' || value === 'OpenAI' || value === OpenAICtor) return 'OpenAI';
        if (value === 'groq' || value === 'Groq' || value === GroqCtor) return 'Groq';
        return null;
      }),
      parseDomain: jasmine.createSpy('parseDomain').and.callFake((value: any) => {
        if (value === 'openai' || value === 'OpenAI' || value === OpenAICtor) return OpenAICtor;
        if (value === 'groq' || value === 'Groq' || value === GroqCtor) return GroqCtor;
        return null;
      }),
      ...overrides?.['factory'],
    };

    const presenter = jasmine.createSpyObj<OutputPresenter>('OutputPresenter', [
      'showUI',
      'showGoodbye',
      'showModelSwitched',
      'showModelList',
      'showWarning',
      'showResponse',
      'showElapsedTime',
      'clearElapsedTime',
    ]);

    const app = new AIAssistantApp(factory as any, presenter);
    return { app, presenter, strategy, factory };
  };

  it('returns false for empty input and shows UI for help commands', async () => {
    const { app, presenter } = createApp();

    await expectAsync(app.processInput('   ')).toBeResolvedTo(false);
    await expectAsync(app.processInput('ajuda')).toBeResolvedTo(false);

    expect(presenter.showUI).toHaveBeenCalled();
  });

  it('routes non-message interpreted actions through handleAction', async () => {
    const { app } = createApp();
    (app as any).interpreter = {
      interpretUserInputWithFeedback: () => [UserAction.CLEAR, null],
    };
    spyOn<any>(app, 'handleAction').and.resolveTo(true);

    await expectAsync(app.processInput('clear')).toBeResolvedTo(true);
    expect((app as any).handleAction).toHaveBeenCalledWith(UserAction.CLEAR, null);
  });

  it('uses raw input as fallback prompt when interpreter returns empty message', async () => {
    const { app, presenter } = createApp();
    (app as any).interpreter = {
      interpretUserInputWithFeedback: () => [UserAction.MESSAGE, ''],
    };

    await expectAsync(app.processInput('  hello world  ')).toBeResolvedTo(false);
    expect(presenter.showResponse).toHaveBeenCalledWith('OpenAI', 'ok');
  });

  it('throws when model listing returns an error marker', async () => {
    const { app, strategy } = createApp({
      strategy: {
        listDomains: jasmine.createSpy('listDomains').and.resolveTo({
          header: 'header',
          names: ['[ERROR] provider down'],
          prefix: '',
        }),
      },
    });

    await expectAsync(app.listModels('openai')).toBeRejectedWithError('[ERROR] provider down');
    expect(strategy.listDomains).toHaveBeenCalled();
  });

  it('uses registered domain key as provider label even when domain name is obfuscated', async () => {
    const strategy = {
      domainClass: { getDomainName: () => 'fd' },
      useModel: jasmine.createSpy('useModel'),
      getCurrentModel: jasmine.createSpy('getCurrentModel').and.returnValue('m1'),
      execute: jasmine.createSpy('execute').and.resolveTo('ok'),
      listDomains: jasmine.createSpy('listDomains').and.resolveTo({
        header: 'header',
        names: ['m1'],
        prefix: '',
      }),
    };

    const obfuscatedDomainCtor = function fd(): void {} as any;
    obfuscatedDomainCtor.getDomainName = () => 'fd';

    const factory = {
      defaultDomain: 'OpenAI',
      availableDomainKeys: jasmine.createSpy('availableDomainKeys').and.returnValue(['OpenAI']),
      getStrategy: jasmine.createSpy('getStrategy').and.returnValue(strategy),
      getDomainKey: jasmine.createSpy('getDomainKey').and.returnValue('OpenAI'),
      parseDomain: jasmine.createSpy('parseDomain').and.returnValue(obfuscatedDomainCtor),
    };

    const presenter = jasmine.createSpyObj<OutputPresenter>('OutputPresenter', [
      'showUI',
      'showGoodbye',
      'showModelSwitched',
      'showModelList',
      'showWarning',
      'showResponse',
      'showElapsedTime',
      'clearElapsedTime',
    ]);

    const app = new AIAssistantApp(factory as any, presenter);

    await expectAsync(app.listModels('openai')).toBeResolvedTo({
      defaultModel: 'm1',
      models: [{ id: 'm1', modelName: 'm1', provider: 'openai' }],
    });
  });

  it('throws when sending message receives a domain error marker', async () => {
    const { app } = createApp({
      strategy: {
        execute: jasmine.createSpy('execute').and.resolveTo('[ERROR] execution failed'),
      },
    });

    await expectAsync(app.sendMessage('hello')).toBeRejectedWithError('[ERROR] execution failed');
  });

  it('throws when provider is not supported', async () => {
    const { app } = createApp();

    await expectAsync(app.changeProvider('unsupported')).toBeRejectedWithError(
      'Provider não suportado: unsupported'
    );
  });

  it('returns the current model as fallback when provider model list is empty', async () => {
    const { app } = createApp({
      strategy: {
        getCurrentModel: jasmine.createSpy('getCurrentModel').and.returnValue('kept-model'),
        listDomains: jasmine.createSpy('listDomains').and.resolveTo({
          header: 'header',
          names: [],
          prefix: '',
        }),
      },
    });

    await expectAsync(app.getDefaultModel('openai')).toBeResolvedTo('kept-model');
  });

  it('keeps current strategy when listModels receives an unknown provider', async () => {
    const { app, factory, strategy } = createApp();
    factory.parseDomain.and.returnValue(null);

    await expectAsync(app.listModels('unknown')).toBeResolvedTo({
      defaultModel: 'gpt-4o-mini',
      models: [
        { id: 'gpt-4o-mini', modelName: 'gpt-4o-mini', provider: 'openai' },
        { id: 'gpt-4o', modelName: 'gpt-4o', provider: 'openai' },
      ],
    });
    expect(strategy.listDomains).toHaveBeenCalled();
  });

  it('returns first model when current and selected models are not present', async () => {
    const { app } = createApp({
      strategy: {
        getCurrentModel: jasmine.createSpy('getCurrentModel').and.returnValue('missing-model'),
        listDomains: jasmine.createSpy('listDomains').and.resolveTo({
          header: 'header',
          names: ['m-first', 'm-second'],
          prefix: '',
        }),
      },
    });

    await expectAsync(app.getDefaultModel('openai')).toBeResolvedTo('m-first');
  });

  it('warns when switch model receives an invalid value type', async () => {
    const { app, presenter } = createApp();

    await expectAsync(app._handleAction(UserAction.SWITCH_MODEL, null)).toBeResolvedTo(false);
    expect(presenter.showWarning).toHaveBeenCalled();
  });

  it('handles message action with non-string payload as empty message', async () => {
    const { app, strategy } = createApp();
    const enqueueSpy = jasmine.createSpy('enqueueTask');
    (app as any).threadController = { enqueueTask: enqueueSpy };
    (app as any)._queue = { tasks: [] };

    await expectAsync(app._handleAction(UserAction.MESSAGE, null)).toBeResolvedTo(false);
    expect(enqueueSpy).toHaveBeenCalledWith('message', strategy.domainClass, '');
  });
});

import { TestBed } from '@angular/core/testing';

import { AIAssistantApp } from '../../../../../core/application';
import { IChatAssistantApp } from '../../../../../core/application/interfaces';
import { CoreChatGateway } from './core-chat-gateway';

describe('CoreChatGateway Unit Tests', () => {
  let gateway: CoreChatGateway;
  let app: jasmine.SpyObj<IChatAssistantApp>;

  beforeEach(() => {
    app = jasmine.createSpyObj<IChatAssistantApp>('IChatAssistantApp', [
      'getProviders',
      'listModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
      'selectModel',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CoreChatGateway,
        { provide: AIAssistantApp, useValue: app },
      ],
    });

    gateway = TestBed.inject(CoreChatGateway);
  });

  it('delegates provider listing to the injected app', async () => {
    app.getProviders.and.resolveTo(['groq', 'openai']);

    await expectAsync(gateway.getProviders()).toBeResolvedTo(['groq', 'openai']);
    expect(app.getProviders).toHaveBeenCalledOnceWith();
  });

  it('requests models with provider when provided', async () => {
    app.listModels.and.resolveTo({
      defaultModel: 'gemini-2.5-flash',
      models: [{ id: 'gemini-2.5-flash', modelName: 'gemini-2.5-flash', provider: 'gemini' }],
    });

    await expectAsync(gateway.getModels('gemini')).toBeResolvedTo({
      defaultModel: 'gemini-2.5-flash',
      models: [{ id: 'gemini-2.5-flash', modelName: 'gemini-2.5-flash', provider: 'gemini' }],
    });

    expect(app.listModels).toHaveBeenCalledOnceWith('gemini');
  });

  it('returns default model from app', async () => {
    app.getDefaultModel.and.resolveTo('gpt-4o-mini');

    await expectAsync(gateway.getDefaultModel('openai')).toBeResolvedTo('gpt-4o-mini');
    expect(app.getDefaultModel).toHaveBeenCalledOnceWith('openai');
  });

  it('changes provider through the chat app', async () => {
    app.changeProvider.and.resolveTo({ status: 'ok' });

    await expectAsync(gateway.changeProvider('claude')).toBeResolvedTo({ status: 'ok' });
    expect(app.changeProvider).toHaveBeenCalledOnceWith('claude');
  });

  it('syncs provider and model before sending when context is provided', async () => {
    app.changeProvider.and.resolveTo({ status: 'ok' });
    const assistantResponse = {
      input: 'hello',
      response: {
        model: 'llama-3.1-8b-instant',
        response: 'hi there',
      },
    };
    app.sendMessage.and.resolveTo(assistantResponse);

    await expectAsync(gateway.sendMessage('hello', {
      provider: 'groq',
      model: 'llama-3.1-8b-instant',
    })).toBeResolvedTo(assistantResponse);

    expect(app.changeProvider).toHaveBeenCalledOnceWith('groq');
    expect(app.selectModel).toHaveBeenCalledOnceWith('llama-3.1-8b-instant');
    expect(app.sendMessage).toHaveBeenCalledOnceWith('hello');
  });

  it('sends message without provider/model sync when context is missing', async () => {
    app.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'hi there' },
    });

    await gateway.sendMessage('hello');

    expect(app.changeProvider).not.toHaveBeenCalled();
    expect(app.selectModel).not.toHaveBeenCalled();
    expect(app.sendMessage).toHaveBeenCalledOnceWith('hello');
  });
});

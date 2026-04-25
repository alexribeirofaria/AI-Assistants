import { TestBed } from '@angular/core/testing';

import { AIAssistantApp } from '../../../../../core/application';
import { IChatAssistantApp } from '../../../../../core/application/interfaces';
import { ChatErrorHandlerService } from '../../error-handler/chat-error-handler.service';
import { ChatStateService } from '../../state/chat.state.service';
import { CoreChatGateway } from './core-chat-gateway';

describe('CoreChatGateway Unit Tests', () => {
  let gateway: CoreChatGateway;
  let chatState: ChatStateService;
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
        ChatStateService,
        ChatErrorHandlerService,
        { provide: AIAssistantApp, useValue: app },
      ],
    });

    gateway = TestBed.inject(CoreChatGateway);
    chatState = TestBed.inject(ChatStateService);
  });

  it('delegates provider listing to the injected app', async () => {
    app.getProviders.and.resolveTo(['groq', 'openai']);

    await expectAsync(gateway.getProviders()).toBeResolvedTo(['groq', 'openai']);
    await expectAsync(gateway.getProviders()).toBeResolvedTo(['groq', 'openai']);

    expect(app.getProviders).toHaveBeenCalledTimes(2);
  });

  it('uses the selected provider from state when fetching models', async () => {
    chatState.setProvider('gemini');
    app.listModels.and.resolveTo({
      defaultModel: 'gemini-2.5-flash',
      models: [{ id: 'gemini-2.5-flash', modelName: 'gemini-2.5-flash', provider: 'gemini' }],
    });

    await expectAsync(gateway.getModels()).toBeResolvedTo({
      defaultModel: 'gemini-2.5-flash',
      models: [{ id: 'gemini-2.5-flash', modelName: 'gemini-2.5-flash', provider: 'gemini' }],
    });

    expect(app.listModels).toHaveBeenCalledOnceWith('gemini');
  });

  it('propagates selected provider and model when resolving the default model', async () => {
    chatState.setProvider('openai');
    chatState.setModel('gpt-4o-mini');
    app.getDefaultModel.and.resolveTo('gpt-4o-mini');

    await expectAsync(gateway.getDefaultModel()).toBeResolvedTo('gpt-4o-mini');

    expect(app.selectModel).toHaveBeenCalledOnceWith('gpt-4o-mini');
    expect(app.getDefaultModel).toHaveBeenCalledOnceWith('openai');
  });

  it('changes provider through the chat app', async () => {
    app.changeProvider.and.resolveTo({ status: 'ok' });

    await expectAsync(gateway.changeProvider('claude')).toBeResolvedTo({ status: 'ok' });

    expect(app.changeProvider).toHaveBeenCalledOnceWith('claude');
  });

  it('syncs provider and selected model before sending the message', async () => {
    chatState.setProvider('groq');
    chatState.setModel('llama-3.1-8b-instant');
    app.changeProvider.and.resolveTo({ status: 'ok' });
    app.sendMessage.and.resolveTo({
      input: 'hello',
      response: {
        model: 'llama-3.1-8b-instant',
        response: 'hi there',
      },
    });

    await expectAsync(gateway.sendMessage('hello')).toBeResolvedTo({
      input: 'hello',
      response: {
        model: 'llama-3.1-8b-instant',
        response: 'hi there',
      },
    });

    expect(app.changeProvider).toHaveBeenCalledOnceWith('groq');
    expect(app.selectModel).toHaveBeenCalledOnceWith('llama-3.1-8b-instant');
    expect(app.sendMessage).toHaveBeenCalledOnceWith('hello');
  });

  it('sends the message without changing provider when no provider is selected', async () => {
    chatState.setModel('gpt-4o-mini');
    app.sendMessage.and.resolveTo({
      input: 'hello',
      response: {
        model: 'gpt-4o-mini',
        response: 'hi there',
      },
    });

    await gateway.sendMessage('hello');

    expect(app.changeProvider).not.toHaveBeenCalled();
    expect(app.selectModel).toHaveBeenCalledOnceWith('gpt-4o-mini');
    expect(app.sendMessage).toHaveBeenCalledOnceWith('hello');
  });
});

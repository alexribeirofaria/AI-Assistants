import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatService } from '../../../../../core/application/services/chat/chat.service';
import {
  ChatUiErrorStateService,
  GlobalUiErrorStateService,
} from '../../../../../core/infrastructure/errors-handlers';
import { ChatContainerComponent } from './chat-container.component';

describe('ChatContainerComponent Unit Tests', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;
  let chatService: jasmine.SpyObj<ChatService>;
  let chatUiErrorState: ChatUiErrorStateService;
  let globalUiErrorState: GlobalUiErrorStateService;

  beforeEach(async () => {
    chatService = jasmine.createSpyObj<ChatService>('ChatService', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);
    chatService.getProviders.and.resolveTo([]);
    chatService.getModels.and.resolveTo({ defaultModel: undefined, models: [] });
    chatService.getDefaultModel.and.resolveTo(undefined);

    await TestBed.configureTestingModule({
      declarations: [ChatContainerComponent],
      providers: [
        { provide: ChatService, useValue: chatService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
    chatUiErrorState = TestBed.inject(ChatUiErrorStateService);
    globalUiErrorState = TestBed.inject(GlobalUiErrorStateService);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load providers and models on init when providers are available', async () => {
    chatService.getProviders.and.resolveTo(['openai', 'groq']);
    chatService.getModels.and.resolveTo({
      defaultModel: 'gpt-4o',
      models: [{ id: 'gpt-4o', modelName: 'GPT-4o', provider: 'openai' }],
    });

    await (component as any).loadProviders();

    expect(chatService.getProviders).toHaveBeenCalled();
    expect(chatService.getModels).toHaveBeenCalledOnceWith('openai');
    expect(chatService.getDefaultModel).not.toHaveBeenCalled();
    expect(component.providers()).toEqual(['openai', 'groq']);
    expect(component.selectedProvider()).toBe('openai');
    expect(component.selectedModel()).toBe('gpt-4o');
  });

  it('should keep flow and still try loading models when provider loading fails', async () => {
    chatService.getProviders.and.rejectWith(new Error('providers failure'));
    chatService.getModels.and.resolveTo({
      defaultModel: undefined,
      models: [{ id: 'fallback-model', modelName: 'Fallback', provider: 'fd' }],
    });
    chatService.getDefaultModel.and.resolveTo(undefined);

    await (component as any).loadProviders();

    expect(component.messages().length).toBe(0);
    expect(chatService.getModels).toHaveBeenCalledOnceWith(undefined);
  });

  it('should change provider and reload models successfully', async () => {
    chatService.changeProvider.and.resolveTo({ status: 'ok' });
    chatService.getModels.and.resolveTo({
      defaultModel: 'claude-model',
      models: [{ id: 'claude-model', modelName: 'Claude Model', provider: 'claude' }],
    });

    await component.onProviderChange('claude');

    expect(component.selectedProvider()).toBe('claude');
    expect(chatService.changeProvider).toHaveBeenCalledOnceWith('claude');
    expect(chatService.getModels).toHaveBeenCalledOnceWith('claude');
    expect(component.selectedModel()).toBe('claude-model');
  });

  it('should pass selected provider and model when sending message', async () => {
    (component as any)._selectedProvider.set('openai');
    (component as any)._selectedModel.set('gpt-4o-mini');
    chatService.sendMessage.and.resolveTo({
      content: 'assistant reply',
      gatewayStatus: 'Resposta recebida via CoreChatGateway.',
    });

    await component.onMessageSend('hello');

    expect(chatService.sendMessage).toHaveBeenCalledOnceWith('hello', {
      provider: 'openai',
      model: 'gpt-4o-mini',
    });
    expect(component.messages()[0].content).toBe('hello');
    expect(component.messages()[1].content).toBe('assistant reply');
    expect(component.gatewayStatus()).toBe('Resposta recebida via CoreChatGateway.');
    expect(component.isLoading()).toBeFalse();
  });

  it('should append chat friendly error when message sending fails', async () => {
    chatService.sendMessage.and.rejectWith(new Error('technical failure'));

    const sendPromise = component.onMessageSend('hello');
    chatUiErrorState.show('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
    await sendPromise;

    expect(component.messages()[1].content).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
    expect(component.messages()[1].type).toBe('error');
    expect(component.gatewayStatus()).toBe('');
    expect(component.isLoading()).toBeFalse();
  });

  it('should render global ui errors as assistant error messages', () => {
    globalUiErrorState.show('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');

    const lastMessage = component.messages()[component.messages().length - 1];
    expect(lastMessage.content).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
    expect(lastMessage.type).toBe('error');
    expect(lastMessage.role).toBe('assistant');
  });
});

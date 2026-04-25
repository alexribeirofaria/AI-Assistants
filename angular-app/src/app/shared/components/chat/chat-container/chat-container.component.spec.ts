import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatContainerComponent } from './chat-container.component';
import { ChatService } from '../../../services/chat/chat.service';
import { ChatStateService } from '../../../services/chat/state/chat.state.service';

describe('ChatContainerComponent Unit Tests', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;
  let chatState: ChatStateService;
  let chatService: jasmine.SpyObj<ChatService>;

  beforeEach(async () => {
    chatService = jasmine.createSpyObj<ChatService>('ChatService', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ChatContainerComponent],
      providers: [
        ChatStateService,
        { provide: ChatService, useValue: chatService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
    chatState = TestBed.inject(ChatStateService);
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
    expect(chatState.providers()).toEqual(['openai', 'groq']);
    expect(chatState.selectedProvider()).toBe('openai');
    expect(chatState.selectedModel()).toBe('gpt-4o');
  });

  it('should load models without provider when no providers are returned', async () => {
    chatService.getProviders.and.resolveTo([]);
    chatService.getModels.and.resolveTo({
      defaultModel: 'fallback-model',
      models: [{ id: 'fallback-model', modelName: 'Fallback', provider: 'fallback' }],
    });

    await (component as any).loadProviders();

    expect(chatService.getModels).toHaveBeenCalledOnceWith(undefined);
    expect(chatService.getDefaultModel).not.toHaveBeenCalled();
    expect(chatState.selectedProvider()).toBe('');
    expect(chatState.selectedModel()).toBe('fallback-model');
  });

  it('should set provider error and still try loading models when provider loading fails', async () => {
    chatService.getProviders.and.rejectWith(new Error('providers failure'));
    chatService.getModels.and.resolveTo({
      defaultModel: undefined,
      models: [{ id: 'fallback-model', modelName: 'Fallback', provider: 'fd' }],
    });
    chatService.getDefaultModel.and.resolveTo(undefined);

    await (component as any).loadProviders();

    expect(chatState.error()).toBe('Erro ao carregar providers');
    expect(chatService.getModels).toHaveBeenCalledOnceWith(undefined);
    expect(chatState.providers()).toEqual([]);
  });

  it('should set model error when model loading fails during init', async () => {
    chatService.getProviders.and.resolveTo(['openai']);
    chatService.getModels.and.rejectWith(new Error('models failure'));

    await (component as any).loadProviders();

    expect(chatState.error()).toBe('Erro ao carregar modelos');
  });

  it('should change provider and reload models successfully', async () => {
    chatService.changeProvider.and.resolveTo({ status: 'ok' });
    chatService.getModels.and.resolveTo({
      defaultModel: 'claude-model',
      models: [{ id: 'claude-model', modelName: 'Claude Model', provider: 'claude' }],
    });

    await component.onProviderChange('claude');

    expect(chatState.selectedProvider()).toBe('claude');
    expect(chatService.changeProvider).toHaveBeenCalledOnceWith('claude');
    expect(chatService.getModels).toHaveBeenCalledOnceWith('claude');
    expect(chatService.getDefaultModel).not.toHaveBeenCalled();
    expect(chatState.selectedModel()).toBe('claude-model');
  });

  it('should set provider error when provider change fails', async () => {
    chatService.changeProvider.and.rejectWith(new Error('provider failure'));

    await component.onProviderChange('groq');

    expect(chatState.selectedProvider()).toBe('groq');
    expect(chatState.error()).toBe('Erro ao trocar provider');
  });

  it('should update the selected model when onModelChange is called', () => {
    component.onModelChange('gpt4');
    expect(component.selectedModel()).toBe('gpt4');
  });

  it('should send messages when not loading', async () => {
    chatState.setError('old error');
    chatService.sendMessage.and.resolveTo();

    await component.onMessageSend('hello');

    expect(chatService.sendMessage).toHaveBeenCalledOnceWith('hello');
    expect(chatState.error()).toBe('');
  });

  it('should not send messages while already loading', async () => {
    chatState.startStreaming();

    await component.onMessageSend('hello');

    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it('should set message error when sending fails', async () => {
    chatService.sendMessage.and.rejectWith(new Error('send failure'));

    await component.onMessageSend('hello');

    expect(chatState.error()).toBe('Erro ao enviar mensagem');
  });
});

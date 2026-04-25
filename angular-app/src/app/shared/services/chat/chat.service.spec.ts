import { TestBed } from '@angular/core/testing';

import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse,
} from '../../../core/application/interfaces';
import { ChatService } from './chat.service';
import { CoreChatGateway, HttpChatGateway, IChatGateway } from './gateway';
import { ChatStateService } from './state/chat.state.service';

describe('ChatService Unit Tests', () => {
  let service: ChatService;
  let chatState: ChatStateService;
  let primaryGateway: jasmine.SpyObj<IChatGateway>;
  let secondaryGateway: jasmine.SpyObj<IChatGateway>;

  const createGatewaySpy = (): jasmine.SpyObj<IChatGateway> =>
    jasmine.createSpyObj<IChatGateway>('IChatGateway', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);

  beforeEach(() => {
    primaryGateway = createGatewaySpy();
    secondaryGateway = createGatewaySpy();

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        ChatStateService,
        { provide: CoreChatGateway, useValue: primaryGateway },
        { provide: HttpChatGateway, useValue: secondaryGateway },
      ],
    });

    service = TestBed.inject(ChatService);
    chatState = TestBed.inject(ChatStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProviders', () => {
    it('should load providers from the primary gateway when available', async () => {
      primaryGateway.getProviders.and.resolveTo([' custom-a ', '', 'custom-b']);

      await expectAsync(service.getProviders()).toBeResolvedTo(['custom-a', 'custom-b']);
      expect(primaryGateway.getProviders).toHaveBeenCalledOnceWith();
      expect(secondaryGateway.getProviders).not.toHaveBeenCalled();
    });

    it('should fallback to the secondary gateway when the primary provider lookup fails', async () => {
      primaryGateway.getProviders.and.rejectWith(new Error('primary providers failure'));
      secondaryGateway.getProviders.and.resolveTo(['http-a']);

      await expectAsync(service.getProviders()).toBeResolvedTo(['http-a']);
      expect(secondaryGateway.getProviders).toHaveBeenCalledOnceWith();
    });

    it('should fallback to the secondary gateway when the primary returns null providers', async () => {
      primaryGateway.getProviders.and.resolveTo(null as unknown as string[]);
      secondaryGateway.getProviders.and.resolveTo(['http-b']);

      await expectAsync(service.getProviders()).toBeResolvedTo(['http-b']);
      expect(secondaryGateway.getProviders).toHaveBeenCalledOnceWith();
    });

    it('should reject when both gateways return invalid providers', async () => {
      primaryGateway.getProviders.and.resolveTo(null as unknown as string[]);
      secondaryGateway.getProviders.and.resolveTo(undefined as unknown as string[]);

      await expectAsync(service.getProviders()).toBeRejectedWithError(
        'Gateway retornou providers invalidos'
      );
    });
  });

  describe('getModels', () => {
    it('should delegate model loading to the primary gateway first', async () => {
      const mockModels: IModelsListResponse = {
        defaultModel: 'x-1',
        models: [{ id: 'x-1', modelName: 'Model X', provider: 'custom-provider' }],
      };
      primaryGateway.getModels.and.resolveTo(mockModels);

      await expectAsync(service.getModels('custom-provider')).toBeResolvedTo(mockModels);
      expect(primaryGateway.getModels).toHaveBeenCalledOnceWith('custom-provider');
      expect(secondaryGateway.getModels).not.toHaveBeenCalled();
    });

    it('should fallback to the secondary gateway when the primary model lookup fails', async () => {
      const fallbackModels: IModelsListResponse = {
        defaultModel: 'y-1',
        models: [{ id: 'y-1', modelName: 'Model Y', provider: 'provider' }],
      };
      primaryGateway.getModels.and.rejectWith(new Error('primary models failure'));
      secondaryGateway.getModels.and.resolveTo(fallbackModels);

      await expectAsync(service.getModels('provider')).toBeResolvedTo(fallbackModels);
      expect(primaryGateway.getModels).toHaveBeenCalledOnceWith('provider');
      expect(secondaryGateway.getModels).toHaveBeenCalledOnceWith('provider');
    });

    it('should fallback to the secondary gateway when the primary returns invalid models payload', async () => {
      const fallbackModels: IModelsListResponse = {
        defaultModel: 'z-1',
        models: [{ id: 'z-1', modelName: 'Model Z', provider: 'provider' }],
      };
      primaryGateway.getModels.and.resolveTo(null as unknown as IModelsListResponse);
      secondaryGateway.getModels.and.resolveTo(fallbackModels);

      await expectAsync(service.getModels('provider')).toBeResolvedTo(fallbackModels);
      expect(secondaryGateway.getModels).toHaveBeenCalledOnceWith('provider');
    });
  });

  describe('getDefaultModel', () => {
    it('should return the default model from the primary gateway', async () => {
      primaryGateway.getDefaultModel.and.resolveTo('gpt-4.1');

      await expectAsync(service.getDefaultModel()).toBeResolvedTo('gpt-4.1');
      expect(primaryGateway.getDefaultModel).toHaveBeenCalledOnceWith(undefined);
      expect(secondaryGateway.getDefaultModel).not.toHaveBeenCalled();
    });

    it('should trim a non-empty default model value', async () => {
      primaryGateway.getDefaultModel.and.resolveTo('  gpt-4.1-mini  ');

      await expectAsync(service.getDefaultModel('provider')).toBeResolvedTo('gpt-4.1-mini');
      expect(primaryGateway.getDefaultModel).toHaveBeenCalledOnceWith('provider');
    });

    it('should return undefined when both gateways have no default model', async () => {
      primaryGateway.getDefaultModel.and.resolveTo(undefined);
      secondaryGateway.getDefaultModel.and.resolveTo(undefined);

      await expectAsync(service.getDefaultModel()).toBeResolvedTo(undefined);
      expect(secondaryGateway.getDefaultModel).toHaveBeenCalledOnceWith(undefined);
    });

    it('should fallback when the primary gateway returns an invalid blank default model', async () => {
      primaryGateway.getDefaultModel.and.resolveTo('   ');
      secondaryGateway.getDefaultModel.and.resolveTo('fallback-model');

      await expectAsync(service.getDefaultModel()).toBeResolvedTo('fallback-model');
      expect(secondaryGateway.getDefaultModel).toHaveBeenCalledOnceWith(undefined);
    });

    it('should reject blank default model values when both gateways are invalid', async () => {
      primaryGateway.getDefaultModel.and.resolveTo('   ');
      secondaryGateway.getDefaultModel.and.resolveTo(' ');

      await expectAsync(service.getDefaultModel()).toBeRejectedWithError(
        'Gateway retornou default model invalido'
      );
    });
  });

  describe('changeProvider', () => {
    it('should update state before delegating the provider change to the primary gateway', async () => {
      const response: IChangeProviderResponse = { status: 'ok' };
      primaryGateway.changeProvider.and.resolveTo(response);

      await expectAsync(service.changeProvider('claude')).toBeResolvedTo(response);

      expect(chatState.selectedProvider()).toBe('claude');
      expect(primaryGateway.changeProvider).toHaveBeenCalledOnceWith('claude');
    });

    it('should fallback provider change to the secondary gateway when the primary fails', async () => {
      const response: IChangeProviderResponse = { status: 'ok' };
      primaryGateway.changeProvider.and.rejectWith(new Error('primary provider failure'));
      secondaryGateway.changeProvider.and.resolveTo(response);

      await expectAsync(service.changeProvider('gemini')).toBeResolvedTo(response);
      expect(chatState.selectedProvider()).toBe('gemini');
      expect(secondaryGateway.changeProvider).toHaveBeenCalledOnceWith('gemini');
    });

    it('should keep the selected provider in state even when both gateways fail', async () => {
      primaryGateway.changeProvider.and.rejectWith(new Error('primary provider failure'));
      secondaryGateway.changeProvider.and.rejectWith(new Error('secondary provider failure'));

      await expectAsync(service.changeProvider('gemini')).toBeRejectedWithError(
        'secondary provider failure'
      );
      expect(chatState.selectedProvider()).toBe('gemini');
    });
  });

  describe('sendMessage', () => {
    it('should append the response text returned by response.response', async () => {
      const response: IAssistantResponse = {
        input: 'hello',
        response: { response: 'primary answer' },
      };
      primaryGateway.sendMessage.and.resolveTo(response);

      await service.sendMessage('hello');

      const messages = chatState.messages();
      expect(primaryGateway.sendMessage).toHaveBeenCalledOnceWith('hello');
      expect(messages[0].content).toBe('hello');
      expect(messages[1].content).toBe('primary answer');
      expect(messages[1].streaming).toBeFalse();
      expect(chatState.isLoading()).toBeFalse();
      expect(chatState.error()).toBe('');
    });

    it('should fallback to the secondary gateway when the primary send fails', async () => {
      primaryGateway.sendMessage.and.rejectWith(new Error('primary failure'));
      secondaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: { response: 'fallback answer' },
      });

      await service.sendMessage('hello');

      const messages = chatState.messages();
      expect(primaryGateway.sendMessage).toHaveBeenCalledOnceWith('hello');
      expect(secondaryGateway.sendMessage).toHaveBeenCalledOnceWith('hello');
      expect(messages[1].content).toBe('fallback answer');
      expect(chatState.error()).toBe('');
    });

    it('should fallback to the secondary gateway when the primary send returns an empty response', async () => {
      primaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: { response: '   ' },
      });
      secondaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: { response: 'fallback answer' },
      });

      await service.sendMessage('hello');

      const messages = chatState.messages();
      expect(secondaryGateway.sendMessage).toHaveBeenCalledOnceWith('hello');
      expect(messages[1].content).toBe('fallback answer');
    });

    it('should append the response text returned by response.message', async () => {
      primaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: { message: 'assistant message' },
      } as IAssistantResponse);

      await service.sendMessage('hello');

      const messages = chatState.messages();
      expect(messages[1].content).toBe('assistant message');
      expect(messages[1].streaming).toBeFalse();
    });

    it('should stringify response payloads without response or message fields', async () => {
      primaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: { foo: 'bar' },
      } as unknown as IAssistantResponse);

      await service.sendMessage('hello');

      const messages = chatState.messages();
      expect(messages[1].content).toBe(JSON.stringify({ foo: 'bar' }));
    });

    it('should append an empty string when the gateway response payload is missing', async () => {
      primaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: undefined,
      } as unknown as IAssistantResponse);

      await service.sendMessage('hello');

      const messages = chatState.messages();
      expect(messages[1].content).toBe('');
      expect(messages[1].streaming).toBeFalse();
    });

    it('should clear previous errors when starting a new successful send', async () => {
      chatState.setError('old error');
      primaryGateway.sendMessage.and.resolveTo({
        input: 'hello',
        response: { response: 'fresh answer' },
      });

      await service.sendMessage('hello');

      expect(chatState.error()).toBe('');
    });

    it('should set a user-facing error and rethrow when both gateways fail', async () => {
      primaryGateway.sendMessage.and.rejectWith(new Error('primary failure'));
      secondaryGateway.sendMessage.and.rejectWith(new Error('secondary failure'));

      await expectAsync(service.sendMessage('hello')).toBeRejectedWithError('secondary failure');

      const messages = chatState.messages();
      expect(messages[0].content).toBe('hello');
      expect(messages[1].content).toBe('');
      expect(messages[1].streaming).toBeFalse();
      expect(chatState.error()).toBe('Erro ao comunicar com o servidor');
      expect(chatState.isLoading()).toBeFalse();
    });
  });
});

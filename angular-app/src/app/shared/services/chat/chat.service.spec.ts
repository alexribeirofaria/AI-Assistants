import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse,
} from '../../../core/application/interfaces';
import { ChatService } from './chat.service';
import { CoreChatGateway, HttpChatGateway, IChatGateway } from './gateway';

describe('ChatService Unit Tests', () => {
  let service: ChatService;
  let primaryGateway: jasmine.SpyObj<IChatGateway>;
  let secondaryGateway: jasmine.SpyObj<IChatGateway>;

  const createGatewaySpy = (gatewayName: string): jasmine.SpyObj<IChatGateway> => {
    const gatewaySpy = jasmine.createSpyObj<IChatGateway>(gatewayName, [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);
    Object.defineProperty(gatewaySpy, 'constructor', {
      value: { name: gatewayName },
    });
    return gatewaySpy;
  };

  beforeEach(() => {
    primaryGateway = createGatewaySpy('HttpChatGateway');
    secondaryGateway = createGatewaySpy('CoreChatGateway');

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: HttpChatGateway, useValue: primaryGateway },
        { provide: CoreChatGateway, useValue: secondaryGateway },
      ],
    });

    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('normalizes providers returned by the active gateway', async () => {
    primaryGateway.getProviders.and.resolveTo([' openai ', '', 'groq']);

    await expectAsync(service.getProviders()).toBeResolvedTo(['openai', 'groq']);
    expect(primaryGateway.getProviders).toHaveBeenCalledOnceWith();
  });

  it('falls back provider change to secondary gateway when primary fails', async () => {
    const response: IChangeProviderResponse = { status: 'ok' };
    primaryGateway.changeProvider.and.rejectWith(new Error('primary failure'));
    secondaryGateway.changeProvider.and.resolveTo(response);

    await expectAsync(service.changeProvider('gemini')).toBeResolvedTo(response);
    expect(primaryGateway.changeProvider).toHaveBeenCalledOnceWith('gemini');
    expect(secondaryGateway.changeProvider).toHaveBeenCalledOnceWith('gemini');
  });

  it('returns message text and empty gateway status when no fallback is needed', async () => {
    const response: IAssistantResponse = {
      input: 'hello',
      response: { response: 'primary answer' },
    };
    primaryGateway.sendMessage.and.resolveTo(response);

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'primary answer',
      gatewayStatus: '',
    });
  });

  it('returns fallback gateway status when secondary gateway succeeds', async () => {
    primaryGateway.sendMessage.and.rejectWith(new Error('primary failure'));
    secondaryGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback answer' },
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'fallback answer',
      gatewayStatus: 'Resposta recebida via CoreChatGateway.',
    });
  });

  it('forwards provider/model context to gateways during send', async () => {
    primaryGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'ok' },
    });

    await service.sendMessage('hello', { provider: 'openai', model: 'gpt-4o-mini' });

    expect(primaryGateway.sendMessage).toHaveBeenCalled();
    expect(primaryGateway.sendMessage.calls.mostRecent().args).toEqual([
      'hello',
      {
        provider: 'openai',
        model: 'gpt-4o-mini',
      },
    ]);
  });

  it('preserves the original Http error object when both gateways fail', async () => {
    const httpError = new HttpErrorResponse({
      status: 502,
      statusText: 'Bad Gateway',
      url: '/assistant',
    });
    primaryGateway.sendMessage.and.rejectWith(new Error('primary failure'));
    secondaryGateway.sendMessage.and.rejectWith(httpError);

    let thrown: unknown;
    try {
      await service.sendMessage('hello');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBe(httpError);
  });

  it('falls back for invalid non-200 assistant responses', async () => {
    primaryGateway.sendMessage.and.resolveTo({
      input: 'hello',
      statusCode: 503,
      response: { response: 'http answer should not be used' },
    });
    secondaryGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback answer' },
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'fallback answer',
      gatewayStatus: 'Resposta recebida via CoreChatGateway.',
    });
  });

  it('loads models via fallback when the primary payload is invalid', async () => {
    const fallbackModels: IModelsListResponse = {
      defaultModel: 'x-1',
      models: [{ id: 'x-1', modelName: 'Model X', provider: 'provider' }],
    };
    primaryGateway.getModels.and.resolveTo(null as unknown as IModelsListResponse);
    secondaryGateway.getModels.and.resolveTo(fallbackModels);

    await expectAsync(service.getModels('provider')).toBeResolvedTo(fallbackModels);
    expect(secondaryGateway.getModels).toHaveBeenCalledOnceWith('provider');
  });
});

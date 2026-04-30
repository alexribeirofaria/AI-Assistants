import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { IAssistantResponse, IChangeProviderResponse, IModelsListResponse } from '../../interfaces';
import { ChatService } from './chat.service';
import { CoreChatGateway, HttpChatGateway } from '../../../infrastructure/gateway';
import { IChatGateway } from '../../../infrastructure/gateway/interfaces';

describe('ChatService Unit Tests', () => {
  let service: ChatService;
  let httpGateway: jasmine.SpyObj<IChatGateway>;
  let coreGateway: jasmine.SpyObj<IChatGateway>;

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
    httpGateway = createGatewaySpy('HttpChatGateway');
    coreGateway = createGatewaySpy('CoreChatGateway');

    TestBed.configureTestingModule({
      providers: [
        ChatService,
        { provide: HttpChatGateway, useValue: httpGateway },
        { provide: CoreChatGateway, useValue: coreGateway },
      ],
    });

    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('normalizes providers returned by the active gateway', async () => {
    coreGateway.getProviders.and.resolveTo([' openai ', '', 'groq']);

    await expectAsync(service.getProviders()).toBeResolvedTo(['openai', 'groq']);
    expect(coreGateway.getProviders).toHaveBeenCalledOnceWith();
  });

  it('falls back provider change to secondary gateway when primary fails', async () => {
    const response: IChangeProviderResponse = { status: 'ok' };
    coreGateway.changeProvider.and.rejectWith(new Error('primary failure'));
    httpGateway.changeProvider.and.resolveTo(response);

    await expectAsync(service.changeProvider('gemini')).toBeResolvedTo(response);
    expect(coreGateway.changeProvider).toHaveBeenCalledOnceWith('gemini');
    expect(httpGateway.changeProvider).toHaveBeenCalledOnceWith('gemini');
  });

  it('returns message text and empty gateway status when no fallback is needed', async () => {
    const response: IAssistantResponse = {
      input: 'hello',
      response: { response: 'primary answer' },
    };
    coreGateway.sendMessage.and.resolveTo(response);

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'primary answer',
      gatewayStatus: '',
    });
  });

  it('returns fallback gateway status when secondary gateway succeeds', async () => {
    coreGateway.sendMessage.and.rejectWith(new Error('primary failure'));
    httpGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback answer' },
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'fallback answer',
      gatewayStatus: 'Resposta recebida via HttpChatGateway.',
    });
  });

  it('forwards provider/model context to gateways during send', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'ok' },
    });

    await service.sendMessage('hello', { provider: 'openai', model: 'gpt-4o-mini' });

    expect(coreGateway.sendMessage).toHaveBeenCalled();
    expect(coreGateway.sendMessage.calls.mostRecent().args).toEqual([
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
    coreGateway.sendMessage.and.rejectWith(new Error('primary failure'));
    httpGateway.sendMessage.and.rejectWith(httpError);

    let thrown: unknown;
    try {
      await service.sendMessage('hello');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toEqual(jasmine.any(Error));
    expect((thrown as Error).message).toContain('[object Object]');
  });

  it('falls back for invalid non-200 assistant responses', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      statusCode: 503,
      response: { response: 'http answer should not be used' },
    });
    httpGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback answer' },
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'fallback answer',
      gatewayStatus: 'Resposta recebida via HttpChatGateway.',
    });
  });

  it('loads models via fallback when the primary payload is invalid', async () => {
    const fallbackModels: IModelsListResponse = {
      defaultModel: 'x-1',
      models: [{ id: 'x-1', modelName: 'Model X', provider: 'provider' }],
    };
    coreGateway.getModels.and.resolveTo(null as unknown as IModelsListResponse);
    httpGateway.getModels.and.resolveTo(fallbackModels);

    await expectAsync(service.getModels('provider')).toBeResolvedTo(fallbackModels);
    expect(httpGateway.getModels).toHaveBeenCalledOnceWith('provider');
  });

  it('returns undefined when gateways do not provide a valid default model', async () => {
    coreGateway.getDefaultModel.and.resolveTo(undefined);
    httpGateway.getDefaultModel.and.resolveTo(undefined);

    await expectAsync(service.getDefaultModel('provider')).toBeResolvedTo(undefined);
  });

  it('normalizes the default model returned by the gateway', async () => {
    coreGateway.getDefaultModel.and.resolveTo('  gpt-4o-mini  ');

    await expectAsync(service.getDefaultModel('provider')).toBeResolvedTo('gpt-4o-mini');
  });

  it('extracts message content when the gateway response uses the message field', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { message: 'message answer' } as never,
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'message answer',
      gatewayStatus: '',
    });
  });

  it('stringifies assistant responses that do not expose response or message fields', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { foo: 'bar' } as never,
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: JSON.stringify({ foo: 'bar' }),
      gatewayStatus: '',
    });
  });

  it('formats model list payloads into readable chat text', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: {
        header: '=== Groq Models ===',
        names: ['llama-3.3-70b-versatile', 'qwen3-32b'],
        prefix: '',
      } as never,
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: '=== Groq Models ===\n- llama-3.3-70b-versatile\n- qwen3-32b',
      gatewayStatus: '',
    });
  });

  it('formats nested model list payloads from response.response', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: {
        response: {
          header: '=== Groq Models ===',
          names: ['gpt-oss-120b', 'gpt-oss-20b'],
          prefix: '> ',
        },
      } as never,
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: '=== Groq Models ===\n> gpt-oss-120b\n> gpt-oss-20b',
      gatewayStatus: '',
    });
  });

  it('falls back when the assistant payload contains an error field', async () => {
    coreGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { error: 'proxy failure' } as never,
    });
    httpGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback after error payload' },
    });

    await expectAsync(service.sendMessage('hello')).toBeResolvedTo({
      content: 'fallback after error payload',
      gatewayStatus: 'Resposta recebida via HttpChatGateway.',
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { ChatErrorHandlerService } from './chat-error-handler.service';

describe('ChatErrorHandlerService', () => {
  let service: ChatErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatErrorHandlerService],
    });

    service = TestBed.inject(ChatErrorHandlerService);
  });

  it('should create a sanitized public error message for object errors', () => {
    const result = service.handle(
      Object.assign(new Error('Falha de rede'), {
        status: 500,
        statusText: 'Gateway Timeout',
      }),
      {
        source: 'HttpChatGateway',
        operation: 'sendMessage',
        details: { provider: 'openai' },
      }
    );

    expect(result.message).toBe('Falha ao executar sendMessage');
  });

  it('should create a sanitized public error message for primitive errors', () => {
    const result = service.handle('timeout', {
      source: 'CoreChatGateway',
      operation: 'getProviders',
    });

    expect(result.message).toBe('Falha ao executar getProviders');
  });
});

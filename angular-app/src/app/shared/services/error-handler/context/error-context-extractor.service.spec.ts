import { TestBed } from '@angular/core/testing';

import { ErrorContextExtractorService } from './error-context-extractor.service';

describe('ErrorContextExtractorService Unit Tests', () => {
  let service: ErrorContextExtractorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorContextExtractorService],
    });

    service = TestBed.inject(ErrorContextExtractorService);
  });

  it('extracts chat context from sendMessage flow', () => {
    const context = service.extract({
      source: 'HttpChatGateway',
      operation: 'sendMessage',
      channel: 'chat',
    });

    expect(context.module).toBe('chat');
    expect(context.action).toBe('enviar sua mensagem');
    expect(context.moment).toBe('durante a operação');
  });

  it('uses explicit module and action when provided', () => {
    const context = service.extract({
      source: 'AuthService',
      operation: 'login',
      module: 'autenticação',
      userAction: 'entrar na conta',
      moment: 'ao confirmar o acesso',
    });

    expect(context.module).toBe('autenticação');
    expect(context.action).toBe('entrar na conta');
    expect(context.moment).toBe('ao confirmar o acesso');
  });
});

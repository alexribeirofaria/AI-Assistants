import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ErrorFormatterService } from './error-formatter.service';

describe('ErrorFormatterService Unit Tests', () => {
  let service: ErrorFormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorFormatterService],
    });

    service = TestBed.inject(ErrorFormatterService);
  });

  it('formats http errors with structured metadata', () => {
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'technical detail' },
    });

    const formatted = service.format(error, {
      source: 'HttpChatGateway',
      operation: 'sendMessage',
      channel: 'chat',
    });

    expect(formatted.errorType).toBe('HttpErrorResponse');
    expect(formatted.technicalMessage).toBe('technical detail');
    expect(formatted.statusCode).toBe(500);
    expect(formatted.destination).toContain('.log_erros/log_angular_dev_HttpChatGateway_');
    expect(formatted.publicMessage).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
  });

  it('uses fallback technical message when message is missing', () => {
    const formatted = service.format({ name: 'CustomError' }, {
      source: 'AnyService',
      operation: 'load',
      channel: 'global',
    });

    expect(formatted.errorType).toBe('CustomError');
    expect(formatted.technicalMessage).toBe('Erro sem detalhes tecnicos disponiveis');
    expect(formatted.stack).toBeUndefined();
    expect(formatted.publicMessage).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
  });

  it('creates readable log entries with optional fields', () => {
    const formatted = service.format(new Error('boom'), {
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      details: { area: 'chat' },
      channel: 'global',
    });

    const entry = service.toLogEntry(formatted, 7);

    expect(entry).toContain('# Log de Erro 0007');
    expect(entry).toContain('- Endpoint: `handleError`');
    expect(entry).toContain('"area": "chat"');
    expect(entry).toContain('boom');
  });
});

import { TestBed } from '@angular/core/testing';

import { FormattedError } from '../contracts/formatted-error.interface';
import { ErrorFormatterService } from '../formatter/error-formatter.service';
import { ERROR_LOG_WRITER } from './error-log-writer.token';
import { ErrorLoggerService } from './error-logger.service';

describe('ErrorLoggerService Unit Tests', () => {
  let service: ErrorLoggerService;
  let writer: jasmine.SpyObj<{ write: (destination: string, content: string) => void }>;

  const buildFormattedError = (): FormattedError => ({
    id: '1',
    destination: '.log_erros/log_angular_dev_ChatService_20260426.md',
    timestamp: '2026-01-01T00:00:00.000Z',
    source: 'ChatService',
    operation: 'sendMessage',
    errorType: 'Error',
    technicalMessage: 'boom',
    publicMessage: 'Não foi possível enviar sua mensagem no chat durante a operação. O serviço está temporariamente indisponível. Tente mais tarde.',
    classifiedType: 'api-server',
    contextSummary: {
      module: 'chat',
      action: 'enviar sua mensagem',
      moment: 'durante a operação',
    },
    channel: 'chat',
    signature: 'same-signature',
  });

  beforeEach(() => {
    writer = jasmine.createSpyObj('ErrorLogWriter', ['write']);

    TestBed.configureTestingModule({
      providers: [
        ErrorLoggerService,
        ErrorFormatterService,
        {
          provide: ERROR_LOG_WRITER,
          useValue: writer,
        },
      ],
    });

    service = TestBed.inject(ErrorLoggerService);
  });

  it('writes structured logs through the configured writer', () => {
    service.log(buildFormattedError());

    expect(writer.write).toHaveBeenCalledTimes(1);
    expect(writer.write.calls.mostRecent().args[0]).toContain('.log_erros/log_angular_dev_ChatService_');
    expect(writer.write.calls.mostRecent().args[1]).toContain('boom');
  });

  it('avoids duplicate consecutive logs with the same signature', () => {
    const formattedError = buildFormattedError();

    service.log(formattedError);
    service.log(formattedError);

    expect(writer.write).toHaveBeenCalledTimes(1);
  });
});

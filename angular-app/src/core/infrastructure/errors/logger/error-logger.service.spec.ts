import { TestBed } from '@angular/core/testing';
import { ErrorLoggerService } from './error-logger.service';
import { ErrorLoggerUseCase } from '../application/error-logger.usecase';
import { FormattedError } from '../contracts/i-error-formatter';
import { ErrorEntity } from '../domain/error.entity';
import { ErrorContext } from '../domain/error-context.enum';
import { ErrorSeverity } from '../domain/error-severity.enum';

describe('ErrorLoggerService', () => {
  let service: ErrorLoggerService;
  let useCaseSpy: jasmine.SpyObj<ErrorLoggerUseCase>;

  beforeEach(() => {
    useCaseSpy = jasmine.createSpyObj<ErrorLoggerUseCase>('ErrorLoggerUseCase', ['execute']);

    TestBed.configureTestingModule({
      providers: [
        ErrorLoggerService,
        { provide: ErrorLoggerUseCase, useValue: useCaseSpy },
      ],
    });

    service = TestBed.inject(ErrorLoggerService);
  });

  it('deve delegar a persistencia para o use case', () => {
    const formatted: FormattedError = {
      content: 'content',
      destination: 'log_dev_Test_20260430.md',
      publicMessage: 'friendly',
      entity: new ErrorEntity('technical', 'friendly', ErrorContext.Global, ErrorSeverity.Critical, '2026-04-30T00:00:00.000Z', 'Test', 'run'),
    };

    service.log(formatted);

    expect(useCaseSpy.execute).toHaveBeenCalledWith(formatted.entity, formatted.destination);
  });
});

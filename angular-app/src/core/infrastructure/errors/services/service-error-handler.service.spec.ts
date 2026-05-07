import { TestBed } from '@angular/core/testing';
import { ServiceErrorHandlerService } from './service-error-handler.service';
import { ErrorFormatter } from '../formatter/error-formatter';
import { ErrorLoggerService } from '../logger/error-logger.service';
import { UIErrorPresenter } from '../presenter/ui-error-presenter';
import { ErrorSeverity } from '../domain/error-severity.enum';

describe('ServiceErrorHandlerService', () => {
  let service: ServiceErrorHandlerService;
  let presenterSpy: jasmine.SpyObj<UIErrorPresenter>;
  let loggerSpy: jasmine.SpyObj<ErrorLoggerService>;
  let formatter: ErrorFormatter;

  beforeEach(() => {
    presenterSpy = jasmine.createSpyObj<UIErrorPresenter>('UIErrorPresenter', ['present']);
    loggerSpy = jasmine.createSpyObj<ErrorLoggerService>('ErrorLoggerService', ['log']);

    TestBed.configureTestingModule({
      providers: [
        ServiceErrorHandlerService,
        ErrorFormatter,
        { provide: UIErrorPresenter, useValue: presenterSpy },
        { provide: ErrorLoggerService, useValue: loggerSpy },
      ],
    });

    service = TestBed.inject(ServiceErrorHandlerService);
    formatter = TestBed.inject(ErrorFormatter);
  });

  it('deve retornar o erro original marcado e apresentar mensagem amigavel', () => {
    const error = new Error('fail');
    const formatted = formatter.format(error, {
      source: 'TestService',
      operation: 'saveData',
      severity: ErrorSeverity.High,
      channel: 'chat',
    });

    const result = service.handle(error, {
      source: 'TestService',
      operation: 'saveData',
      severity: ErrorSeverity.High,
      channel: 'chat',
    });

    expect(result).toBe(error);
    expect(loggerSpy.log).toHaveBeenCalled();
    expect(presenterSpy.present).toHaveBeenCalledWith(formatted.publicMessage, 'chat');
  });

  it('nao deve reprocessar erros ja manipulados', () => {
    const error = new Error('fail');
    const handled = service.handle(error, {
      source: 'TestService',
      operation: 'saveData',
    });

    const result = service.handle(handled, {
      source: 'TestService',
      operation: 'saveData',
    });

    expect(result).toBe(handled);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    expect(presenterSpy.present).toHaveBeenCalledTimes(1);
  });

  it('deve permitir suprimir apresentacao na UI', () => {
    service.handle(new Error('fail'), {
      source: 'TestService',
      operation: 'backgroundTask',
      presentToUser: false,
    });

    expect(presenterSpy.present).not.toHaveBeenCalled();
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});

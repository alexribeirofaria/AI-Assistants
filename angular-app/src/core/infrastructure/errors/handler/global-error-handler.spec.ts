import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandler } from './global-error-handler';
import { ServiceErrorHandlerService } from '../services/service-error-handler.service';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorContext } from '../domain/error-context.enum';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;
  let serviceSpy: jasmine.SpyObj<ServiceErrorHandlerService>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj<ServiceErrorHandlerService>('ServiceErrorHandlerService', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: ServiceErrorHandlerService, useValue: serviceSpy },
      ],
    });

    handler = TestBed.inject(GlobalErrorHandler);
  });

  it('deve delegar erros runtime para o service handler', () => {
    const error = new Error('runtime failure');
    serviceSpy.handle.and.returnValue(error);

    handler.handleError(error);

    expect(serviceSpy.handle).toHaveBeenCalledWith(error, jasmine.objectContaining({
      source: 'GlobalErrorHandler',
      operation: 'runtime',
      severity: ErrorSeverity.Critical,
      context: ErrorContext.Global,
    }));
  });

  it('deve classificar erros http como network', () => {
    const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    serviceSpy.handle.and.returnValue(new Error('friendly'));

    handler.handleError(error);

    expect(serviceSpy.handle).toHaveBeenCalledWith(error, jasmine.objectContaining({
      category: 'network',
      severity: ErrorSeverity.High,
      context: ErrorContext.Http,
    }));
  });

  it('nao deve propagar falhas internas do sistema de erro', () => {
    serviceSpy.handle.and.throwError('critical failure');
    const consoleSpy = spyOn(console, 'error');

    expect(() => handler.handleError(new Error('original error'))).not.toThrow();
    expect(consoleSpy).toHaveBeenCalledWith('Falha critica no GlobalErrorHandler:', jasmine.any(Error));
  });
});

import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ServiceErrorHandlerService } from './service-error-handler.service';

describe('ServiceErrorHandlerService Unit Tests', () => {
  let service: ServiceErrorHandlerService;
  let fetchSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceErrorHandlerService],
    });

    service = TestBed.inject(ServiceErrorHandlerService);
    fetchSpy = spyOn(window, 'fetch').and.returnValue(Promise.resolve({} as Response));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a public error message for Http errors', () => {
    const httpError = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'technical detail' },
    });

    const result = service.handle(httpError, {
      source: 'HttpChatGateway',
      operation: 'sendMessage',
    });

    expect(result).toEqual(jasmine.any(Error));
    expect(result.message).toBe('Falha ao executar sendMessage');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should return a public error message for Core errors', () => {
    const coreError = new Error('core low-level failure');

    const result = service.handle(coreError, {
      source: 'CoreChatGateway',
      operation: 'sendMessage',
    });

    expect(result).toEqual(jasmine.any(Error));
    expect(result.message).toBe('Falha ao executar sendMessage');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should handle unknown primitive errors safely', () => {
    const result = service.handle('plain string failure', {
      source: 'AnyService',
      operation: 'getData',
    });

    expect(result).toEqual(jasmine.any(Error));
    expect(result.message).toBe('Falha ao executar getData');
    expect(fetchSpy).toHaveBeenCalled();
  });
});

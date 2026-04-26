import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ERROR_LOG_WRITER } from './logger/error-log-writer.token';
import { UIErrorPresenterService } from './presenter/ui-error-presenter.service';
import { ServiceErrorHandlerService } from './service-error-handler.service';

describe('ServiceErrorHandlerService Unit Tests', () => {
  let service: ServiceErrorHandlerService;
  let presenter: jasmine.SpyObj<UIErrorPresenterService>;

  beforeEach(() => {
    presenter = jasmine.createSpyObj<UIErrorPresenterService>('UIErrorPresenterService', ['present']);

    TestBed.configureTestingModule({
      providers: [
        ServiceErrorHandlerService,
        {
          provide: UIErrorPresenterService,
          useValue: presenter,
        },
        {
          provide: ERROR_LOG_WRITER,
          useValue: jasmine.createSpyObj('ErrorLogWriter', ['write']),
        },
      ],
    });

    service = TestBed.inject(ServiceErrorHandlerService);
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
      channel: 'chat',
    });

    expect(result).toEqual(jasmine.any(Error));
    expect(result.message).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
  });

  it('should return a public error message for Core errors', () => {
    const coreError = new Error('core low-level failure');

    const result = service.handle(coreError, {
      source: 'CoreChatGateway',
      operation: 'sendMessage',
      channel: 'global',
    });

    expect(result).toEqual(jasmine.any(Error));
    expect(result.message).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
  });

  it('should handle unknown primitive errors safely', () => {
    const result = service.handle('plain string failure', {
      source: 'AnyService',
      operation: 'getData',
      channel: 'global',
    });

    expect(result).toEqual(jasmine.any(Error));
    expect(result.message).toBe('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.');
  });

  it('does not reprocess errors already marked as handled', () => {
    const handled = service.handle(new Error('first pass'), {
      source: 'AnyService',
      operation: 'getData',
      channel: 'chat',
    });

    const result = service.handle(handled, {
      source: 'AnyService',
      operation: 'getData',
      channel: 'chat',
    });

    expect(result).toBe(handled);
    expect(presenter.present).toHaveBeenCalledTimes(1);
  });
});

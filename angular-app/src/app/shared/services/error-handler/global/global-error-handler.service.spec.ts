import { TestBed } from '@angular/core/testing';

import { ServiceErrorHandlerService } from '../service-error-handler.service';
import { GlobalErrorHandlerService } from './global-error-handler.service';

describe('GlobalErrorHandlerService Unit Tests', () => {
  let service: GlobalErrorHandlerService;
  let serviceErrorHandler: jasmine.SpyObj<ServiceErrorHandlerService>;

  beforeEach(() => {
    serviceErrorHandler = jasmine.createSpyObj<ServiceErrorHandlerService>('ServiceErrorHandlerService', ['handle']);
    serviceErrorHandler.handle.and.returnValue(new Error('Não consegui responder agora. Tente mais tarde ou troque o provider/modelo.'));

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandlerService,
        {
          provide: ServiceErrorHandlerService,
          useValue: serviceErrorHandler,
        },
      ],
    });

    service = TestBed.inject(GlobalErrorHandlerService);
  });

  it('delegates unexpected errors to the shared handler', () => {
    const error = new Error('runtime failure');

    service.handleError(error);

    expect(serviceErrorHandler.handle).toHaveBeenCalledOnceWith(error, {
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      channel: 'global',
    });
  });
});

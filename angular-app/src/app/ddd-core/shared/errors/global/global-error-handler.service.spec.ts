import { TestBed } from '@angular/core/testing';

import { ServiceErrorContext } from '../contracts/service-error-context.interface';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ServiceErrorHandlerService } from '../service-error-handler.service';
import { GlobalErrorContextFactoryService } from './global-error-context-factory.service';

describe('GlobalErrorHandlerService Unit Tests', () => {
  let service: GlobalErrorHandlerService;
  let errorHandler: jasmine.SpyObj<ServiceErrorHandlerService>;
  let contextFactory: jasmine.SpyObj<GlobalErrorContextFactoryService>;

  beforeEach(() => {
    errorHandler = jasmine.createSpyObj<ServiceErrorHandlerService>('ServiceErrorHandlerService', ['handle']);
    contextFactory = jasmine.createSpyObj<GlobalErrorContextFactoryService>(
      'GlobalErrorContextFactoryService',
      ['createRuntimeContext']
    );
    contextFactory.createRuntimeContext.and.returnValue({
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      channel: 'global',
    });

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandlerService,
        {
          provide: ServiceErrorHandlerService,
          useValue: errorHandler,
        },
        {
          provide: GlobalErrorContextFactoryService,
          useValue: contextFactory,
        },
      ],
    });

    service = TestBed.inject(GlobalErrorHandlerService);
  });

  it('delegates unexpected errors to the shared handler', () => {
    const error = new Error('runtime failure');
    const context: ServiceErrorContext = {
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      channel: 'global',
    };
    contextFactory.createRuntimeContext.and.returnValue(context);

    service.handleError(error);

    expect(errorHandler.handle).toHaveBeenCalledOnceWith(error, context);
  });
});

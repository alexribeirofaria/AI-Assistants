import { ErrorHandler, Injectable } from '@angular/core';

import { ServiceErrorHandlerService } from '../service-error-handler.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private readonly serviceErrorHandler: ServiceErrorHandlerService) {}

  handleError(error: unknown): void {
    this.serviceErrorHandler.handle(error, {
      source: 'GlobalErrorHandler',
      operation: 'handleError',
      channel: 'global',
    });
  }
}

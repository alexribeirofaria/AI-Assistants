import { ErrorHandler, Injectable } from '@angular/core';

import { ServiceErrorHandlerService } from '../service-error-handler.service';
import { GlobalErrorContextFactoryService } from './global-error-context-factory.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(
    private readonly serviceErrorHandler: ServiceErrorHandlerService,
    private readonly contextFactory: GlobalErrorContextFactoryService
  ) {}

  handleError(error: unknown): void {
    this.serviceErrorHandler.handle(error, this.contextFactory.createRuntimeContext());
  }
}

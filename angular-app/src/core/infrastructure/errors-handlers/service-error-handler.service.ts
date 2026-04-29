import { Injectable } from '@angular/core';

import { ErrorFormatterService } from './formatter/error-formatter.service';
import { ErrorLoggerService } from './logger/error-logger.service';
import { UIErrorPresenterService } from './presenter/ui-error-presenter.service';
import { ServiceErrorContext } from './contracts/service-error-context.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceErrorHandlerService {
  private static readonly HANDLED_ERROR_FLAG = '__globalErrorHandled';

  constructor(
    private readonly formatter: ErrorFormatterService,
    private readonly logger: ErrorLoggerService,
    private readonly presenter: UIErrorPresenterService
  ) {}

  handle(error: unknown, context: ServiceErrorContext): Error {
    if (this.isHandledError(error)) {
      return error;
    }

    const formattedError = this.formatter.format(error, context);
    this.logger.log(formattedError);
    if (context.presentToUser !== false) {
      this.presenter.present({
        message: formattedError.publicMessage,
        channel: formattedError.channel,
      });
    }

    return this.createHandledError(formattedError.publicMessage);
  }

  private isHandledError(error: unknown): error is Error & Record<string, unknown> {
    return error instanceof Error
      && ServiceErrorHandlerService.HANDLED_ERROR_FLAG in error
      && error[ServiceErrorHandlerService.HANDLED_ERROR_FLAG] === true;
  }

  private createHandledError(message: string): Error {
    const handledError = new Error(message) as Error & Record<string, unknown>;
    handledError[ServiceErrorHandlerService.HANDLED_ERROR_FLAG] = true;
    return handledError;
  }
}

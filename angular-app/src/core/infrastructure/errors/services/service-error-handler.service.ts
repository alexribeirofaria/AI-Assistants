import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFormatter } from '../formatter/error-formatter';
import { ErrorLoggerService } from '../logger/error-logger.service';
import { UIErrorPresenter } from '../presenter/ui-error-presenter';
import { ErrorContext } from '../contracts/i-error-context';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorContext as DomainErrorContext } from '../domain/error-context.enum';

@Injectable({
  providedIn: 'root',
})
export class ServiceErrorHandlerService {
  private static readonly HANDLED_ERROR_FLAG = '__globalErrorHandled';

  constructor(
    private readonly formatter: ErrorFormatter,
    private readonly logger: ErrorLoggerService,
    private readonly presenter: UIErrorPresenter,
  ) {}

  handle(error: unknown, context: ErrorContext): Error {
    const candidate = this.unwrapError(error);
    if (this.isHandledError(candidate)) {
      return candidate;
    }

    const formatted = this.formatter.format(candidate, this.normalizeContext(candidate, context));
    this.logger.log(formatted);

    if (context.presentToUser !== false) {
      this.presenter.present(formatted.publicMessage, context.channel ?? 'global');
    }

    const handledError = candidate instanceof Error ? candidate : new Error(formatted.publicMessage);
    Object.defineProperty(handledError, ServiceErrorHandlerService.HANDLED_ERROR_FLAG, {
      value: true,
      configurable: true,
      enumerable: false,
      writable: false,
    });

    return handledError;
  }

  private unwrapError(error: unknown): Error | unknown {
    if (error instanceof HttpErrorResponse && error.error instanceof Error) {
      return error.error;
    }

    return error;
  }

  private normalizeContext(error: unknown, context: ErrorContext): ErrorContext {
    if (context.severity && context.context) {
      return context;
    }

    if (error instanceof HttpErrorResponse) {
      return {
        ...context,
        category: 'network',
        severity: context.severity ?? ErrorSeverity.High,
        context: context.context ?? DomainErrorContext.Http,
      };
    }

    return {
      ...context,
      severity: context.severity ?? ErrorSeverity.Critical,
      context: context.context ?? (context.channel === 'chat' ? DomainErrorContext.Chat : DomainErrorContext.Global),
    };
  }

  private isHandledError(error: unknown): error is Error {
    return error instanceof Error && Boolean((error as Error & Record<string, unknown>)[ServiceErrorHandlerService.HANDLED_ERROR_FLAG]);
  }
}

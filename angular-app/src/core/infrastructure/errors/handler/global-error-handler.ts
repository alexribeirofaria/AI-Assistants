import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceErrorHandlerService } from '../services/service-error-handler.service';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorContext } from '../domain/error-context.enum';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private readonly injector: Injector) {}

  handleError(error: unknown): void {
    const handler = this.injector.get(ServiceErrorHandlerService);

    try {
      handler.handle(error, {
        source: this.extractSource(error),
        operation: 'runtime',
        category: error instanceof HttpErrorResponse ? 'network' : 'technical',
        severity: error instanceof HttpErrorResponse ? ErrorSeverity.High : ErrorSeverity.Critical,
        context: error instanceof HttpErrorResponse ? ErrorContext.Http : ErrorContext.Global,
        channel: 'global',
      });
    } catch (criticalError) {
      console.error('Falha critica no GlobalErrorHandler:', criticalError);
      console.error('Erro original:', error);
    }
  }

  private extractSource(error: unknown): string {
    if (error && typeof error === 'object' && 'source' in error && typeof (error as { source?: unknown }).source === 'string') {
      return (error as { source: string }).source;
    }

    return 'GlobalErrorHandler';
  }
}

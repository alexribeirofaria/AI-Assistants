import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ErrorEntity } from '../domain/error.entity';
import { ErrorContext as DomainErrorContext } from '../domain/error-context.enum';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ErrorFormatterService } from '../application/error-formatter.service';
import { ErrorMessageResolverService } from '../application/error-message-resolver.service';
import { ErrorContext } from '../contracts/i-error-context';
import { FormattedError, IErrorFormatter } from '../contracts/i-error-formatter';

@Injectable({
  providedIn: 'root',
})
export class ErrorFormatter implements IErrorFormatter {
  constructor(
    private readonly formatter: ErrorFormatterService,
    private readonly messageResolver: ErrorMessageResolverService,
  ) {}

  format(error: unknown, context: ErrorContext): FormattedError {
    const timestamp = (context.timestamp ?? new Date()).toISOString();
    const severity = context.severity ?? this.resolveSeverity(context.category);
    const entity = new ErrorEntity(
      this.extractMessage(error),
      this.messageResolver.resolve(context.operation, severity),
      context.context ?? this.resolveContext(context.channel, context.category),
      severity,
      timestamp,
      context.source,
      context.operation,
      this.extractStack(error),
      context.details,
      environment.production ? 'prod' : 'dev',
    );

    return {
      content: this.formatter.format(entity),
      destination: this.buildDestination(entity),
      publicMessage: entity.friendlyMessage,
      entity,
    };
  }

  private buildDestination(error: ErrorEntity): string {
    const source = error.source.replace(/[^a-zA-Z0-9]+/g, '_') || 'Global';
    const date = error.timestamp.slice(0, 10).replace(/-/g, '');
    return `log_${error.environment}_${source}_${date}.md`;
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return (error as { message: string }).message;
    }

    return 'Unknown error';
  }

  private extractStack(error: unknown): string | undefined {
    if (error instanceof Error) {
      return error.stack;
    }

    if (error && typeof error === 'object' && 'stack' in error && typeof (error as { stack?: unknown }).stack === 'string') {
      return (error as { stack: string }).stack;
    }

    return undefined;
  }

  private resolveSeverity(category?: ErrorContext['category']): ErrorSeverity {
    if (category === 'network') {
      return ErrorSeverity.High;
    }

    return ErrorSeverity.Critical;
  }

  private resolveContext(channel?: ErrorContext['channel'], category?: ErrorContext['category']): DomainErrorContext {
    if (category === 'network') {
      return DomainErrorContext.Http;
    }

    if (channel === 'chat') {
      return DomainErrorContext.Chat;
    }

    return DomainErrorContext.Global;
  }
}

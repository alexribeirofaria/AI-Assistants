import { Injectable } from '@angular/core';

export interface ServiceErrorContext {
  source: string;
  operation: string;
  details?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceErrorHandlerService {
  handle(error: unknown, context: ServiceErrorContext): Error {
    const normalized = this.normalizeError(error);
    this.reportClientError(normalized, context);

    return new Error(this.getPublicMessage(context.operation));
  }

  private normalizeError(error: unknown): {
    name: string;
    message: string;
    status?: unknown;
    statusText?: unknown;
  } {
    if (error && typeof error === 'object') {
      return {
        name: 'name' in error ? String((error as { name?: unknown }).name ?? 'Error') : 'Error',
        message: 'message' in error ? String((error as { message?: unknown }).message ?? '') : String(error),
        status: 'status' in error ? (error as { status?: unknown }).status : undefined,
        statusText: 'statusText' in error ? (error as { statusText?: unknown }).statusText : undefined,
      };
    }

    return {
      name: 'Error',
      message: String(error),
    };
  }

  private getPublicMessage(operation: string): string {
    return `Falha ao executar ${operation}`;
  }

  private reportClientError(
    normalizedError: {
      name: string;
      message: string;
      status?: unknown;
      statusText?: unknown;
    },
    context: ServiceErrorContext
  ): void {
    if (typeof fetch !== 'function') {
      return;
    }

    const statusCode = typeof normalizedError.status === 'number'
      ? normalizedError.status
      : 500;

    const payload = {
      source: context.source,
      operation: context.operation,
      endpoint: context.operation,
      method: 'CLIENT',
      reqUrl: '/api/__client-error-log',
      statusCode,
      code: normalizedError.statusText ?? normalizedError.name,
      message: normalizedError.message,
      details: context.details ?? null,
      timestamp: new Date().toISOString(),
    };

    void fetch('/api/__client-error-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
  }
}

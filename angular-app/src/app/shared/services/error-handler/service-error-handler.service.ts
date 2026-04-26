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
    void normalized;

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
}

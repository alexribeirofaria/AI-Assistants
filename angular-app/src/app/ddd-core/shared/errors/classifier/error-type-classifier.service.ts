import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ErrorType } from '../interfaces';

@Injectable({
  providedIn: 'root',
})

export class ErrorTypeClassifierService {
  classify(error: unknown): ErrorType {
    if (this.isOfflineError(error)) {
      return 'network-offline';
    }

    if (this.isTimeoutError(error)) {
      return 'network-timeout';
    }

    if (this.isValidationError(error)) {
      return 'validation';
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'api-unauthorized';
      }

      if (error.status === 403) {
        return 'api-forbidden';
      }

      if (error.status >= 500) {
        return 'api-server';
      }

      if (error.status >= 400) {
        return 'api-client';
      }
    }

    const status = this.extractNumber(error, 'status');
    if (status === 401) {
      return 'api-unauthorized';
    }
    if (status === 403) {
      return 'api-forbidden';
    }
    if (typeof status === 'number' && status >= 500) {
      return 'api-server';
    }
    if (typeof status === 'number' && status >= 400) {
      return 'api-client';
    }

    return 'unexpected';
  }

  private isOfflineError(error: unknown): boolean {
    const status = this.extractNumber(error, 'status');
    const message = this.extractMessage(error);
    const offlineNavigator = typeof navigator !== 'undefined' && navigator.onLine === false;

    return (status === 0 && /offline|networkerror|failed to fetch|network error/i.test(message))
      || offlineNavigator;
  }

  private isTimeoutError(error: unknown): boolean {
    const name = this.extractString(error, 'name');
    const message = this.extractMessage(error);

    return /timeout/i.test(name) || /timeout|timed out|exceeded/i.test(message);
  }

  private isValidationError(error: unknown): boolean {
    if (error instanceof HttpErrorResponse && error.status === 422) {
      return true;
    }

    const status = this.extractNumber(error, 'status');
    const name = this.extractString(error, 'name');
    const message = this.extractMessage(error);

    return status === 422 || /validation/i.test(name) || /validation|invalid|required|campo/i.test(message);
  }

  private extractMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const payload = error.error;
      if (payload && typeof payload === 'object' && 'message' in payload) {
        const payloadMessage = (payload as { message?: unknown }).message;
        if (typeof payloadMessage === 'string') {
          return payloadMessage;
        }
      }

      return error.message ?? '';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return this.extractString(error, 'message');
  }

  private extractString(error: unknown, key: string): string {
    if (!error || typeof error !== 'object') {
      return '';
    }

    const value = (error as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : '';
  }

  private extractNumber(error: unknown, key: string): number | undefined {
    if (!error || typeof error !== 'object') {
      return undefined;
    }

    const value = (error as Record<string, unknown>)[key];
    return typeof value === 'number' ? value : undefined;
  }
}

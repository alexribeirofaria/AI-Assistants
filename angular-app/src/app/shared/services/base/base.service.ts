import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ServiceErrorHandlerService } from '../error-handler';

export interface FallbackChainContext<THandler, TResult> {
  handlers: readonly THandler[];
  operation: (handler: THandler) => Promise<TResult>;
  validate?: (result: TResult) => boolean;
  invalidResultMessage?: string;
}

export interface BaseServiceDependencies {
  http?: HttpClient;
  errorHandler?: ServiceErrorHandlerService;
}

@Injectable()
export abstract class BaseService {
  protected baseUrl = environment.BASE_URL;
  protected readonly http?: HttpClient;
  protected readonly errorHandler?: ServiceErrorHandlerService;

  constructor(dependencies: BaseServiceDependencies = {}) {
    this.http = dependencies.http;
    this.errorHandler = dependencies.errorHandler;
  }

  // Default REST operations. Subclasses may override any method.
  protected get<T>(endpoint: string): Observable<T> {
    if (!this.http) {
      throw this.buildServiceError('get', 'HttpClient não configurado para este serviço');
    }

    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  protected post<T>(endpoint: string, body: unknown): Observable<T> {
    if (!this.http) {
      throw this.buildServiceError('post', 'HttpClient não configurado para este serviço');
    }

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected put<T>(endpoint: string, body: unknown): Observable<T> {
    if (!this.http) {
      throw this.buildServiceError('put', 'HttpClient não configurado para este serviço');
    }

    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body);
  }

  protected delete<T>(endpoint: string): Observable<T> {
    if (!this.http) {
      throw this.buildServiceError('delete', 'HttpClient não configurado para este serviço');
    }

    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  protected async executeWithFallbackChain<THandler, TResult>(
    context: FallbackChainContext<THandler, TResult>
  ): Promise<TResult> {
    if (!context.handlers.length) {
      throw this.buildServiceError(
        'executeWithFallbackChain',
        'Nenhum handler disponível para executar a cadeia de fallback'
      );
    }

    let lastError: Error | null = null;

    for (const handler of context.handlers) {
      try {
        const result = await context.operation(handler);

        if (context.validate && !context.validate(result)) {
          lastError = this.buildServiceError(
            'executeWithFallbackChain',
            context.invalidResultMessage ?? 'Resultado inválido na cadeia de fallback'
          );
          continue;
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error
          ? error
          : this.buildServiceError('executeWithFallbackChain', String(error));
      }
    }

    throw lastError ?? this.buildServiceError('executeWithFallbackChain', 'Falha ao executar cadeia de fallback');
  }

  protected buildServiceError(operation: string, message: string): Error {
    if (!this.errorHandler) {
      return new Error(message);
    }

    return this.errorHandler.handle(new Error(message), {
      source: this.constructor.name,
      operation,
    });
  }
}

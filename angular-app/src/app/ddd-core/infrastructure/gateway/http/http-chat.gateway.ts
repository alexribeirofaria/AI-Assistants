import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';
import { IAssistantResponse, IChangeProviderResponse, IModelsListResponse, IProviderListResponse } from '../../../application/interfaces';
import { BaseService } from '../../../application/services/abstract/base.service';
import { ServiceErrorHandlerService } from '../../../shared/errors';
import { IChatGateway, IChatMessageContext } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class HttpChatGateway extends BaseService implements IChatGateway {
  private static readonly REQUEST_TIMEOUT_MS = 8000;

  constructor(
    http: HttpClient,
    errorHandler: ServiceErrorHandlerService
  ) {
    super({ http, errorHandler });
  }

  async getProviders(): Promise<string[]> {
    const response = await firstValueFrom(
      this.get<IProviderListResponse>('/providers')
        .pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS))
    );
    this.throwIfGatewayErrorPayload(response, 'getProviders');
    return response.providers || [];
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    const normalizedProvider = this.normalizeProviderForHttp(provider);
    const params = normalizedProvider ? `?provider=${encodeURIComponent(normalizedProvider)}` : '';
    const response = await firstValueFrom(
      this.get<IModelsListResponse>(`/models${params}`)
        .pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS))
    );
    this.throwIfGatewayErrorPayload(response, 'getModels');
    return {
      defaultModel: response.defaultModel,
      models: response.models || [],
    };
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    const normalizedProvider = this.normalizeProviderForHttp(provider);
    const params = normalizedProvider ? `?provider=${encodeURIComponent(normalizedProvider)}` : '';
    const response = await firstValueFrom(
      this.get<IModelsListResponse>(`/default-model${params}`)
        .pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS))
    );
    this.throwIfGatewayErrorPayload(response, 'getDefaultModel');
    return response.defaultModel;
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    const normalizedProvider = this.normalizeProviderForHttp(provider);
    const response = await firstValueFrom(
      this.post<IChangeProviderResponse>('/change-provider', { provider: normalizedProvider })
        .pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS))
    );
    this.throwIfGatewayErrorPayload(response, 'changeProvider');
    return response;
  }

  async sendMessage(content: string, _context?: IChatMessageContext): Promise<IAssistantResponse> {
    if (!this.http) {
      throw this.buildServiceError('sendMessage', 'HttpClient não configurado para este serviço');
    }

    const response = await firstValueFrom(
      this.http
        .post<IAssistantResponse>(`${this.baseUrl}/assistant`, { message: content }, { observe: 'response' })
        .pipe(timeout(HttpChatGateway.REQUEST_TIMEOUT_MS))
    );

    const body = response.body ?? { input: content };
    this.throwIfGatewayErrorPayload(body, 'sendMessage');
    return {
      ...body,
      statusCode: response.status,
    };
  }

  private throwIfGatewayErrorPayload(response: unknown, operation: string): void {
    if (!response || typeof response !== 'object') {
      return;
    }

    const payload = response as { error?: unknown; status?: unknown };
    const hasErrorMessage =
      typeof payload.error === 'string' && payload.error.trim().length > 0;
    const status = typeof payload.status === 'number' ? payload.status : null;
    const isErrorStatus = status !== null && status >= 400;

    if (!hasErrorMessage && !isErrorStatus) {
      return;
    }

    throw this.buildServiceError(
      operation,
      hasErrorMessage ? payload.error as string : `Falha HTTP (${status})`
    );
  }

  private normalizeProviderForHttp(provider?: string): string {
    return (provider ?? '').trim().toLowerCase().replace(/\s+/g, '');
  }
}

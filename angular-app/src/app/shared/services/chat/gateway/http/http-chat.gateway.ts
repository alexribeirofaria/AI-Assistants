import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse,
  IProviderListResponse,
} from '../../../../../core/application/interfaces';
import { BaseService } from '../../../base/base.service';
import { ServiceErrorHandlerService } from '../../../error-handler';
import { ChatMessageContext, IChatGateway } from '../i-chat-gateway';

@Injectable({
  providedIn: 'root',
})
export class HttpChatGateway extends BaseService implements IChatGateway {
  constructor(
    http: HttpClient,
    errorHandler: ServiceErrorHandlerService
  ) {
    super({ http, errorHandler });
  }

  async getProviders(): Promise<string[]> {
    const response = await firstValueFrom(this.get<IProviderListResponse>('/providers'));
    return response.providers || [];
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    const params = provider ? `?provider=${encodeURIComponent(provider)}` : '';
    const response = await firstValueFrom(this.get<IModelsListResponse>(`/models${params}`));
    return {
      defaultModel: response.defaultModel,
      models: response.models || [],
    };
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    const params = provider ? `?provider=${encodeURIComponent(provider)}` : '';
    const response = await firstValueFrom(this.get<IModelsListResponse>(`/default-model${params}`));
    return response.defaultModel;
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return firstValueFrom(this.post<IChangeProviderResponse>('/change-provider', { provider }));
  }

  async sendMessage(content: string, _context?: ChatMessageContext): Promise<IAssistantResponse> {
    if (!this.http) {
      throw this.buildServiceError('sendMessage', 'HttpClient não configurado para este serviço');
    }

    const response = await firstValueFrom(
      this.http.post<IAssistantResponse>(`${this.baseUrl}/assistant`, { message: content }, { observe: 'response' })
    );

    const body = response.body ?? { input: content };
    return {
      ...body,
      statusCode: response.status,
    };
  }
}

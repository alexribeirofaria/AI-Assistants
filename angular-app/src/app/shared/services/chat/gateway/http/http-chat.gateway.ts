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
import { IChatGateway } from '../i-chat-gateway';

@Injectable({
  providedIn: 'root',
})
export class HttpChatGateway extends BaseService implements IChatGateway {
  constructor(http: HttpClient) {
    super(http);
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
    const response = await firstValueFrom(this.get<IModelsListResponse>(`/models${params}`));
    return response.defaultModel;
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return firstValueFrom(this.post<IChangeProviderResponse>('/change-provider', { provider }));
  }

  async sendMessage(content: string): Promise<IAssistantResponse> {
    return firstValueFrom(this.post<IAssistantResponse>('/assistant', { message: content }));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BaseService } from '../base/base.service';
import { ChatStateService } from './state/chat.state.service';
import { IHomeModel } from '../../models';
import {
  IProviderListResponse,
  IModelsListResponse,
  IAssistantResponse,
  IChangeProviderResponse
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseService {

  constructor(
    http: HttpClient,
    private chatState: ChatStateService
  ) {
    super(http);
  }

  async getProviders(): Promise<string[]> {
    const response = await firstValueFrom(this.get<IProviderListResponse>('/providers'));
    return response.providers || [];
  }

  async getModels(provider?: string): Promise<IHomeModel[]> {
    const params = provider ? '?provider=' + encodeURIComponent(provider) : '';
    const response = await firstValueFrom(this.get<IModelsListResponse>('/models' + params));
    return response.models || [];
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return firstValueFrom(this.post<IChangeProviderResponse>('/change-provider', { provider }));
  }

  async sendMessage(content: string): Promise<void> {
    this.chatState.addUserMessage(content);
    this.chatState.startStreaming();

    try {
      const data = await firstValueFrom(this.post<IAssistantResponse>('/assistant', { message: content }));
      const response = data?.response;
      const text = response?.response 
        ?? response?.message 
        ?? JSON.stringify(response);
      
      this.chatState.appendChunk(text);
      this.chatState.stopStreaming();
    } catch (err) {
      this.chatState.setError('Erro ao comunicar com o servidor');
      this.chatState.stopStreaming();
      throw err;
    }
  }
}

import { Inject, Injectable } from '@angular/core';

import { AIAssistantApp } from '../../../../../core/application';
import {
  IAssistantResponse,
  IChangeProviderResponse,
  IChatAssistantApp,
  IModelsListResponse,
} from '../../../../../core/application/interfaces';
import { ChatStateService } from '../../state/chat.state.service';
import { IChatGateway } from '../i-chat-gateway';

@Injectable({
  providedIn: 'root',
})
export class CoreChatGateway implements IChatGateway {
  constructor(
    private readonly chatState: ChatStateService,
    @Inject(AIAssistantApp)
    private readonly app: IChatAssistantApp
  ) {}

  private get selectedProvider(): string | undefined {
    return this.chatState.selectedProvider() || undefined;
  }

  async getProviders(): Promise<string[]> {
    return this.app.getProviders();
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.app.listModels(provider ?? this.selectedProvider);
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    this.app.selectModel(this.chatState.selectedModel());
    return this.app.getDefaultModel(provider ?? this.selectedProvider);
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return this.app.changeProvider(provider);
  }

  async sendMessage(content: string): Promise<IAssistantResponse> {
    if (this.selectedProvider) {
      await this.app.changeProvider(this.selectedProvider);
    }

    this.app.selectModel(this.chatState.selectedModel());
    return this.app.sendMessage(content);
  }
}

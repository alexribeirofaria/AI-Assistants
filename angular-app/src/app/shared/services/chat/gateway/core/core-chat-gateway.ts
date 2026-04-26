import { Inject, Injectable } from '@angular/core';

import { AIAssistantApp } from '../../../../../core/application';
import {
  IAssistantResponse,
  IChangeProviderResponse,
  IChatAssistantApp,
  IModelsListResponse,
} from '../../../../../core/application/interfaces';
import { ChatMessageContext, IChatGateway } from '../i-chat-gateway';

@Injectable({
  providedIn: 'root',
})
export class CoreChatGateway implements IChatGateway {
  constructor(
    @Inject(AIAssistantApp)
    private readonly app: IChatAssistantApp
  ) {}

  async getProviders(): Promise<string[]> {
    return this.app.getProviders();
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.app.listModels(provider);
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    return this.app.getDefaultModel(provider);
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return this.app.changeProvider(provider);
  }

  async sendMessage(content: string, context?: ChatMessageContext): Promise<IAssistantResponse> {
    if (context?.provider) {
      await this.app.changeProvider(context.provider);
    }

    if (context?.model) {
      this.app.selectModel(context.model);
    }

    return this.app.sendMessage(content);
  }
}

import { Inject, Injectable } from '@angular/core';

import { AIAssistantApp } from '../../../../../core/application';
import {
  IAssistantResponse,
  IChangeProviderResponse,
  IChatAssistantApp,
  IModelsListResponse,
} from '../../../../../core/application/interfaces';
import { BaseService } from '../../../base/base.service';
import { ServiceErrorHandlerService } from '../../../error-handler';
import { ChatMessageContext, IChatGateway } from '../i-chat-gateway';

@Injectable({
  providedIn: 'root',
})
export class CoreChatGateway extends BaseService implements IChatGateway {
  constructor(
    @Inject(AIAssistantApp)
    private readonly app: IChatAssistantApp,
    errorHandler: ServiceErrorHandlerService
  ) {
    super({ errorHandler });
  }

  async getProviders(): Promise<string[]> {
    return this.run('getProviders', () => this.app.getProviders());
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.run('getModels', () => this.app.listModels(provider));
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    return this.run('getDefaultModel', () => this.app.getDefaultModel(provider));
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return this.run('changeProvider', () => this.app.changeProvider(provider));
  }

  async sendMessage(content: string, context?: ChatMessageContext): Promise<IAssistantResponse> {
    return this.run('sendMessage', async () => {
      if (context?.provider) {
        await this.app.changeProvider(context.provider);
      }

      if (context?.model) {
        this.app.selectModel(context.model);
      }

      return this.app.sendMessage(content);
    });
  }

  private async run<T>(operation: string, action: () => Promise<T>): Promise<T> {
    try {
      return await action();
    } catch (error) {
      throw this.buildServiceError(
        operation,
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}

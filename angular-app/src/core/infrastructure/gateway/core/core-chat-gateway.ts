import { Inject, Injectable } from '@angular/core';
import { AIAssistantApp } from '../../../application';
import {
  IAssistantResponse,
  IChangeProviderResponse,
  IChatAssistantApp,
  IModelsListResponse
} from '../../../application/interfaces';
import { ServiceErrorHandlerService } from '../../errors/services/service-error-handler.service';
import { IChatGateway, IChatMessageContext } from '../interfaces';
import { IHttpErrorShape } from './interfaces/i-http-error-shape';

@Injectable({
  providedIn: 'root',
})
export class CoreChatGateway implements IChatGateway {

  constructor(
    @Inject(AIAssistantApp)
    private readonly app: IChatAssistantApp,
    private readonly errorHandler: ServiceErrorHandlerService
  ) {}

  private async run<T>(
    operation: string,
    action: () => Promise<T>,
    presentToUser = false
  ): Promise<T> {
    try {
      return await action();
    } catch (error: unknown) {
      const message = this.extractErrorMessage(error);

      throw this.errorHandler.handle(new Error(message), {
        source: CoreChatGateway.name,
        operation,
        channel: 'chat',
        presentToUser,
      });
    }
  }
  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return this.cleanMessage(error);
    }

    if (this.isHttpError(error)) {
      const response = error.response;

      if (typeof response === 'string') {
        return this.cleanMessage(response);
      }

      if (typeof response?.data === 'string') {
        return this.cleanMessage(response.data);
      }

      if (response?.data?.error?.message) {
        return this.cleanMessage(response.data.error.message);
      }

      if (response?.data?.message) {
        return this.cleanMessage(response.data.message);
      }
    }

    if (error instanceof Error) {
      return this.cleanMessage(error.message);
    }

    return 'Erro desconhecido';
  }

  private cleanMessage(message: string): string {
    return message
      .replace(/^\[.*?\]\s*/i, '')
      .replace(/^\d+\s*/, '')
      .trim();
  }

  private isHttpError(error: unknown): error is IHttpErrorShape {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error
    );
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

  async sendMessage(
    content: string,
    context?: IChatMessageContext
  ): Promise<IAssistantResponse> {
    return this.run('sendMessage', async () => {

      if (context?.provider) {
        await this.app.changeProvider(context.provider);
      }

      if (context?.model) {
        this.app.selectModel(context.model);
      }

      return this.app.sendMessage(content);
    }, true);
  }
}

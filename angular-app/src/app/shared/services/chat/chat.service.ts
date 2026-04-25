import { Injectable } from '@angular/core';

import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse,
} from '../../../core/application/interfaces';
import { CoreChatGateway, HttpChatGateway, IChatGateway } from './gateway';
import { ChatStateService } from './state/chat.state.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private readonly chatState: ChatStateService,
    private readonly primaryGateway: CoreChatGateway,
    private readonly secondaryGateway: HttpChatGateway
  ) {}

  async getProviders(): Promise<string[]> {
    return this.executeWithChain((gateway) => this.getValidatedProviders(gateway));
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.executeWithCoreFallback(
      () => this.primaryGateway.getModels(provider),
      () => this.secondaryGateway.getModels(provider),
      (response) => Array.isArray(response?.models),
      'Core gateway retornou models invalidos'
    );
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    const model = await this.executeWithCoreFallback(
      () => this.primaryGateway.getDefaultModel(provider),
      () => this.secondaryGateway.getDefaultModel(provider),
      (value) => Boolean(this.normalizeDefaultModel(value)),
      'Core gateway retornou default model invalido'
    );

    return this.normalizeDefaultModel(model);
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    this.chatState.setProvider(provider);
    return this.executeWithChain((gateway) => gateway.changeProvider(provider));
  }

  async sendMessage(content: string): Promise<void> {
    this.chatState.addUserMessage(content);
    this.chatState.startStreaming();

    try {
      const data = await this.executeWithCoreFallback(
        () => this.primaryGateway.sendMessage(content),
        () => this.secondaryGateway.sendMessage(content),
        (response) => Boolean(this.extractResponseText(response).trim()),
        'Core gateway retornou resposta invalida'
      );

      const text = this.extractResponseText(data);

      this.chatState.appendChunk(text);
      this.chatState.stopStreaming();
    } catch (err) {
      this.chatState.setError('Erro ao comunicar com o servidor');
      this.chatState.stopStreaming();
      throw err;
    }
  }

  private extractResponseText(data: IAssistantResponse): string {
    const response = data?.response;
    if (response?.response) {
      return response.response;
    }

    if (response?.message) {
      return response.message;
    }

    return response ? JSON.stringify(response) : '';
  }

  private async getValidatedProviders(gateway: IChatGateway): Promise<string[]> {
    const providers = await gateway.getProviders();
    const normalized = this.normalizeProviders(providers);

    if (!Array.isArray(providers) && normalized.length === 0) {
      throw new Error('Gateway retornou providers invalidos');
    }

    return normalized;
  }

  private normalizeProviders(providers: string[] | null | undefined): string[] {
    if (!Array.isArray(providers)) {
      return [];
    }

    return providers
      .map((provider) => provider?.trim())
      .filter((provider): provider is string => Boolean(provider));
  }

  private normalizeDefaultModel(model: string | undefined | null): string | undefined {
    if (!model) {
      return undefined;
    }

    const normalized = model.trim();
    return normalized || undefined;
  }

  private async executeWithCoreFallback<TResult>(
    coreOperation: () => Promise<TResult>,
    fallbackOperation: () => Promise<TResult>,
    isValidCoreResult: (value: TResult) => boolean,
    coreInvalidMessage: string
  ): Promise<TResult> {
    try {
      const coreResult = await coreOperation();
      if (!isValidCoreResult(coreResult)) {
        throw new Error(coreInvalidMessage);
      }
      return coreResult;
    } catch {
      return fallbackOperation();
    }
  }

  private async executeWithChain<TResult>(
    operation: (gateway: IChatGateway) => Promise<TResult>
  ): Promise<TResult> {
    let lastError: unknown;

    for (const gateway of [this.primaryGateway, this.secondaryGateway]) {
      try {
        return await operation(gateway);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Nenhum gateway disponivel');
  }
}

import { Injectable } from '@angular/core';

import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse
} from '../../../core/application/interfaces';
import { BaseService } from '../base/base.service';
import { ServiceErrorHandlerService } from '../error-handler';
import {
  ChatGatewayChainFactory,
  ChatGatewayChainHandler,
  CoreChatGateway,
  HttpChatGateway
} from './gateway';
import { ChatMessageContext } from './gateway/i-chat-gateway';
import { GatewayChainObserver } from './gateway/chain/interfaces';

export interface SendMessageResult {
  content: string;
  gatewayStatus: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseService {
  private readonly gatewayChain: ChatGatewayChainHandler;

  constructor(
    httpGateway: HttpChatGateway,
    coreGateway: CoreChatGateway,
    errorHandler: ServiceErrorHandlerService
  ) {
    super({ errorHandler });
    this.gatewayChain = ChatGatewayChainFactory.create([httpGateway, coreGateway]);
  }

  async getProviders(): Promise<string[]> {
    const providers = await this.gatewayChain.handle({
      operation: (gateway) => gateway.getProviders(),
      validate: (result) => Array.isArray(result),
      invalidResultMessage: 'Gateway retornou providers invalidos',
    });

    return this.normalizeProviders(providers);
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.gatewayChain.handle({
      operation: (gateway) => gateway.getModels(provider),
      validate: (result) => Array.isArray(result?.models),
      invalidResultMessage: 'Gateway retornou models invalidos',
    });
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    let hasMissingModel = false;

    try {
      const model = await this.gatewayChain.handle({
        operation: async (gateway) => {
          const value = await gateway.getDefaultModel(provider);
          if (typeof value !== 'string') {
            hasMissingModel = true;
          }
          return value;
        },
        validate: (result) => typeof result === 'string' && result.trim().length > 0,
        invalidResultMessage: 'Gateway retornou default model invalido',
      });

      return this.normalizeDefaultModel(model);
    } catch (error) {
      if (hasMissingModel) {
        return undefined;
      }
      throw error;
    }
  }

  async changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return this.gatewayChain.handle({
      operation: (gateway) => gateway.changeProvider(provider),
    });
  }

  async sendMessage(content: string, context?: ChatMessageContext): Promise<SendMessageResult> {
    let usedFallback = false;
    let gatewayStatus = '';

    const observer: GatewayChainObserver = {
      onFallback: ({ fromGateway, toGateway }) => {
        usedFallback = true;
        gatewayStatus = `Falha em ${fromGateway}. Alternando para ${toGateway}...`;
      },
      onSuccess: ({ gatewayName }) => {
        if (!usedFallback) {
          gatewayStatus = '';
          return;
        }

        gatewayStatus = `Resposta recebida via ${gatewayName}.`;
      },
      onFailure: () => {
        gatewayStatus = '';
      },
    };

    const data = await this.gatewayChain.handle({
      operation: (gateway) => gateway.sendMessage(content, context),
      validate: (result) => this.isValidAssistantResponse(result),
      invalidResultMessage: 'Gateway retornou resposta invalida',
      operationName: 'sendMessage',
      observer,
    });

    return {
      content: this.extractResponseText(data),
      gatewayStatus,
    };
  }

  private extractResponseText(data: IAssistantResponse): string {
    const response = data?.response;
    if (!response) {
      return '';
    }

    if (Object.prototype.hasOwnProperty.call(response, 'response')
      && typeof response.response === 'string') {
      return response.response;
    }

    if (Object.prototype.hasOwnProperty.call(response, 'message')
      && typeof response.message === 'string') {
      return response.message;
    }

    return JSON.stringify(response);
  }

  private isValidAssistantResponse(result: IAssistantResponse): boolean {
    const statusCode = result.statusCode;
    if (typeof statusCode === 'number' && statusCode !== 200) {
      return false;
    }

    return this.extractResponseText(result).trim().length > 0;
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
}

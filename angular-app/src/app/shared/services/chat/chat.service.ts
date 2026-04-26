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
import { GatewayChainObserver } from './gateway/chain/interfaces';
import { ChatMessageContext } from './gateway/i-chat-gateway';

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
    this.gatewayChain = ChatGatewayChainFactory.create([coreGateway, httpGateway]);
  }

  async getProviders(): Promise<string[]> {
    const providers = await this.gatewayChain.handle({
      operation: (gateway) => gateway.getProviders(),
      validate: (result) => Array.isArray(result),
      invalidResultMessage: 'Gateway retornou providers invalidos',
      operationName: 'getProviders',
      observer: this.buildLoggingObserver(),
    });

    return this.normalizeProviders(providers);
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.gatewayChain.handle({
      operation: (gateway) => gateway.getModels(provider),
      validate: (result) => Array.isArray(result?.models),
      invalidResultMessage: 'Gateway retornou models invalidos',
      operationName: 'getModels',
      observer: this.buildLoggingObserver(),
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
        operationName: 'getDefaultModel',
        observer: this.buildLoggingObserver(),
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
      operationName: 'changeProvider',
      observer: this.buildLoggingObserver(),
    });
  }

  async sendMessage(content: string, context?: ChatMessageContext): Promise<SendMessageResult> {
    let usedFallback = false;
    let gatewayStatus = '';

    const observer: GatewayChainObserver = {
      onFallback: ({ operation, fromGateway, toGateway, error }) => {
        usedFallback = true;
        gatewayStatus = `Falha em ${fromGateway}. Alternando para ${toGateway}...`;
        this.registerGatewayFailure(error, fromGateway, operation, { toGateway }, false);
      },
      onSuccess: ({ gatewayName }) => {
        if (!usedFallback) {
          gatewayStatus = '';
          return;
        }

        gatewayStatus = `Resposta recebida via ${gatewayName}.`;
      },
      onFailure: ({ operation, gatewayName, error }) => {
        gatewayStatus = '';
        this.registerGatewayFailure(error, gatewayName, operation);
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
    const status = (result as unknown as { status?: unknown })?.status;
    if (typeof status === 'number' && status >= 400) {
      return false;
    }

    const statusCode = result.statusCode;
    if (typeof statusCode === 'number' && statusCode !== 200) {
      return false;
    }

    const response = result?.response as unknown as { error?: unknown } | undefined;
    if (response && typeof response.error === 'string' && response.error.trim().length > 0) {
      return false;
    }

    const text = this.extractResponseText(result).trim();
    if (!text.length) {
      return false;
    }

    if (this.isTechnicalErrorText(text)) {
      return false;
    }

    return true;
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

  private registerGatewayFailure(
    error: unknown,
    gatewayName: string,
    operation: string,
    details?: Record<string, unknown>,
    presentToUser = true
  ): void {
    this.errorHandler?.handle(error, {
      source: gatewayName,
      operation,
      details,
      channel: operation === 'sendMessage' ? 'chat' : 'global',
      presentToUser,
    });
  }

  private isTechnicalErrorText(text: string): boolean {
    const normalized = text.toLowerCase();
    return normalized.startsWith('[unknown error]')
      || normalized.startsWith('[quota error]')
      || normalized.includes('decommissioned')
      || normalized.includes('no longer supported')
      || normalized.includes('api key');
  }

  private buildLoggingObserver(): GatewayChainObserver {
    return {
      onFallback: ({ operation, fromGateway, toGateway, error }) => {
        this.registerGatewayFailure(error, fromGateway, operation, { toGateway });
      },
      onFailure: ({ operation, gatewayName, error }) => {
        this.registerGatewayFailure(error, gatewayName, operation);
      },
    };
  }
}

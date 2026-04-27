import { Injectable } from '@angular/core';

import { IAssistantResponse, IChangeProviderResponse, IModelsListResponse } from '../../../ddd-core/application/interfaces';
import { BaseService } from '../base/base.service';
import { ServiceErrorHandlerService } from '../error-handler';
import { ChatGatewayObserverFactory, CoreChatGateway, HttpChatGateway } from './gateway';
import { createChatGatewayChainHandler } from './gateway/chain/factory/create-chat-gateway-chain-handler';
import { ChatGatewayChainHandler } from './gateway/chain/handler';
import { IChatMessageContext } from './gateway/interfaces';
import { SendMessageResult } from './interfaces';


@Injectable({
  providedIn: 'root',
})

export class ChatService extends BaseService {
  private static readonly HANDLED_ERROR_FLAG = '__globalErrorHandled';

  private gatewayChain: ChatGatewayChainHandler;
  private readonly coreGateway: CoreChatGateway;
  private readonly httpGateway: HttpChatGateway;
  private readonly observerFactory: ChatGatewayObserverFactory;

  constructor(
    httpGateway: HttpChatGateway,
    coreGateway: CoreChatGateway,
    errorHandler: ServiceErrorHandlerService
  ) {
    super({ errorHandler });
    this.coreGateway = coreGateway;
    this.httpGateway = httpGateway;
    this.gatewayChain = createChatGatewayChainHandler([this.coreGateway, this.httpGateway]);
    this.observerFactory = new ChatGatewayObserverFactory((report) => {
      this.registerGatewayFailure(
        report.error,
        report.gatewayName,
        report.operation,
        report.details,
        report.presentToUser
      );
    });
  }

  async getProviders(): Promise<string[]> {
    const providers = await this.gatewayChain.handle<string[]>({
      operation: (gateway) => gateway.getProviders(),
      validate: (result) => Array.isArray(result),
      invalidResultMessage: 'Gateway retornou providers invalidos',
      operationName: 'getProviders',
      observer: this.observerFactory.createSilentObserver(),
    });

    return this.normalizeProviders(providers);
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.gatewayChain.handle({
      operation: (gateway) => gateway.getModels(provider),
      validate: (result: any) => Array.isArray(result?.models),
      invalidResultMessage: 'Gateway retornou models invalidos',
      operationName: 'getModels',
      observer: this.observerFactory.createSilentObserver(),
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
        observer: this.observerFactory.createSilentObserver(),
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
    const response = await this.gatewayChain.handle<IChangeProviderResponse>({
      operation: (gateway) => gateway.changeProvider(provider),
      operationName: 'changeProvider',
      observer: this.observerFactory.createSilentObserver(),
    });

    // Reinicia a chain para garantir estado consistente após troca de provider.
    this.gatewayChain = createChatGatewayChainHandler([this.coreGateway, this.httpGateway]);
    return response;
  }

  async sendMessage(content: string, context?: IChatMessageContext): Promise<SendMessageResult> {
    let usedFallback = false;
    let gatewayStatus = '';

    const observer = this.observerFactory.createInteractiveSendObserver({
      markFallbackUsed: () => {
        usedFallback = true;
      },
      isFallbackUsed: () => usedFallback,
      setGatewayStatus: (status: string) => {
        gatewayStatus = status;
      },
    });

    const data = await this.gatewayChain.handle<IAssistantResponse>({
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

  private registerGatewayFailure(
    error: unknown,
    gatewayName: string,
    operation: string,
    details?: Record<string, unknown>,
    presentToUser = true
  ): void {
    this.errorHandler?.handle(this.unwrapHandledError(error), {
      source: gatewayName,
      operation,
      details,
      channel: operation === 'sendMessage' ? 'chat' : 'global',
      presentToUser,
    });
  }

  private unwrapHandledError(error: unknown): unknown {
    if (!(error instanceof Error)) {
      return error;
    }

    const maybeHandled = error as Error & Record<string, unknown>;
    if (maybeHandled[ChatService.HANDLED_ERROR_FLAG] !== true) {
      return error;
    }

    // Recria o erro para registrar no contexto atual do gateway/operation da chain.
    const cloned = new Error(error.message);
    cloned.name = error.name;
    return cloned;
  }
}

import { Injectable } from '@angular/core';
import { ResponseTextExtractor } from '../../../domain/extractors/response-text.extractor';
import { ModelNormalizer } from '../../../domain/normalizers/model.normalizer';
import { ProviderNormalizer } from '../../../domain/normalizers/provider.normalizer';
import { AssistantResponseValidator } from '../../../domain/normalizers/validators/assistant-response.validator';
import { ChatGatewayObserverFactory, CoreChatGateway, HttpChatGateway, SendMessageObserverState } from '../../../infrastructure';
import { createChatGatewayChainHandler } from '../../../infrastructure/gateway/chain/factory/create-chat-gateway-chain-handler';
import { ChatGatewayChainHandler } from '../../../infrastructure/gateway/chain/handler/chat-gateway-chain-handler';
import { IChatMessageContext } from '../../../infrastructure/gateway/interfaces';
import { ServiceErrorHandlerService } from '../../../infrastructure/errors/services/service-error-handler.service';
import { ISendMessageResponse } from '../../responses/i-send-message-response';
import { IAssistantResponse, IChangeProviderResponse, IModelsListResponse } from '../../interfaces';
import { BaseService } from '../abstract/base.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService extends BaseService {
  private static readonly HANDLED_ERROR_FLAG = '__globalErrorHandled';

  private gatewayChain: ChatGatewayChainHandler;
  private readonly coreGateway: CoreChatGateway;
  private readonly httpGateway: HttpChatGateway;
  private readonly observerFactory: ChatGatewayObserverFactory;
  private readonly providerNormalizer: ProviderNormalizer;
  private readonly modelNormalizer: ModelNormalizer;
  private readonly responseTextExtractor: ResponseTextExtractor;
  private readonly assistantResponseValidator: AssistantResponseValidator;

  constructor(
    httpGateway: HttpChatGateway,
    coreGateway: CoreChatGateway,
    errorHandler: ServiceErrorHandlerService
  ) {
    super({ errorHandler });
    this.coreGateway = coreGateway;
    this.httpGateway = httpGateway;
    this.gatewayChain = this.buildGatewayChain();
    this.providerNormalizer = new ProviderNormalizer();
    this.modelNormalizer = new ModelNormalizer();
    this.responseTextExtractor = new ResponseTextExtractor();
    this.assistantResponseValidator = new AssistantResponseValidator(this.responseTextExtractor);
    this.observerFactory = this.buildObserverFactory();
  }

  async getProviders(): Promise<string[]> {
    const providers = await this.gatewayChain.handle<string[]>({
      operation: (gateway) => gateway.getProviders(),
      validate: (result) => Array.isArray(result),
      invalidResultMessage: 'Gateway retornou providers invalidos',
      operationName: 'getProviders',
      observer: this.observerFactory.createSilentObserver(),
    });

    return this.providerNormalizer.normalize(providers);
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.gatewayChain.handle<IModelsListResponse>({
      operation: (gateway) => gateway.getModels(provider),
      validate: (result: unknown) => this.hasModelList(result),
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

      return this.modelNormalizer.normalize(model);
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

    this.gatewayChain = this.buildGatewayChain();
    return response;
  }

  async sendMessage(content: string, context?: IChatMessageContext): Promise<ISendMessageResponse> {
    const sendState = this.createSendObserverState();
    const observer = this.observerFactory.createInteractiveSendObserver(sendState.observerConfig);

    const data = await this.gatewayChain.handle<IAssistantResponse>({
      operation: (gateway) => gateway.sendMessage(content, context),
      validate: (result) => this.assistantResponseValidator.isValid(result),
      invalidResultMessage: 'Gateway retornou resposta invalida',
      operationName: 'sendMessage',
      observer,
    });

    return {
      content: this.responseTextExtractor.extract(data),
      gatewayStatus: sendState.gatewayStatus(),
    };
  }

  private buildGatewayChain(): ChatGatewayChainHandler {
    return createChatGatewayChainHandler([this.coreGateway, this.httpGateway]);
  }

  private buildObserverFactory(): ChatGatewayObserverFactory {
    return new ChatGatewayObserverFactory((report) => {
      this.registerGatewayFailure(
        report.error,
        report.gatewayName,
        report.operation,
        report.details,
        report.presentToUser
      );
    });
  }

  private hasModelList(result: unknown): result is IModelsListResponse {
    if (!result || typeof result !== 'object') {
      return false;
    }

    const modelResponse = result as { models?: unknown };
    return Array.isArray(modelResponse.models);
  }

  private createSendObserverState(): { observerConfig: SendMessageObserverState; gatewayStatus: () => string } {
    let usedFallback = false;
    let status = '';

    return {
      observerConfig: {
        markFallbackUsed: () => {
          usedFallback = true;
        },
        isFallbackUsed: () => usedFallback,
        setGatewayStatus: (gatewayStatus: string) => {
          status = gatewayStatus;
        },
      },
      gatewayStatus: () => status,
    };
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
    return error;
  }
}

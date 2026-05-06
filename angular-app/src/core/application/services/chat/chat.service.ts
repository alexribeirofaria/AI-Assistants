import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseTextExtractor } from "../../../domain/extractors/response-text.extractor";
import { ModelNormalizer } from "../../../domain/normalizers/model.normalizer";
import { ProviderNormalizer } from "../../../domain/normalizers/provider.normalizer";
import { AssistantResponseValidator } from "../../../domain/normalizers/validators/assistant-response.validator";
import {
  ChatGatewayObserverFactory,
  CoreChatGateway,
  HttpChatGateway,
  SendMessageObserverState,
} from "../../../infrastructure";
import { ServiceErrorHandlerService } from "../../../infrastructure/errors/services/service-error-handler.service";
import { createChatGatewayChainHandler } from "../../../infrastructure/gateway/chain/factory/create-chat-gateway-chain-handler";
import { ChatGatewayChainHandler } from "../../../infrastructure/gateway/chain/handler/chat-gateway-chain-handler";
import { BaseHttpGateway } from "../../../infrastructure/gateway/http/abstract/base-http.gateway";
import { IChatMessageContext } from "../../../infrastructure/gateway/interfaces";
import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse,
} from "../../interfaces";
import { ISendMessageResponse } from "../../responses/i-send-message-response";

@Injectable({
  providedIn: "root",
})
export class ChatService extends BaseHttpGateway {
  private static readonly HANDLED_ERROR_FLAG = "__globalErrorHandled";

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
    errorHandler: ServiceErrorHandlerService,
  ) {
    super({ errorHandler });
    this.coreGateway = coreGateway;
    this.httpGateway = httpGateway;
    this.gatewayChain = this.buildGatewayChain();
    this.providerNormalizer = new ProviderNormalizer();
    this.modelNormalizer = new ModelNormalizer();
    this.responseTextExtractor = new ResponseTextExtractor();
    this.assistantResponseValidator = new AssistantResponseValidator(
      this.responseTextExtractor,
    );
    this.observerFactory = this.buildObserverFactory();
  }

  async getProviders(): Promise<string[]> {
    const providers = await this.gatewayChain.handle<string[]>({
      operation: (gateway) => gateway.getProviders(),
      validate: (result) => Array.isArray(result),
      invalidResultMessage: "Gateway retornou providers invalidos",
      operationName: "getProviders",
      observer: this.observerFactory.createSilentObserver(),
    });

    return this.providerNormalizer.normalize(providers);
  }

  async getModels(provider?: string): Promise<IModelsListResponse> {
    return this.gatewayChain.handle<IModelsListResponse>({
      operation: (gateway) => gateway.getModels(provider),
      validate: (result: unknown) => this.hasModelList(result),
      invalidResultMessage: "Gateway retornou models invalidos",
      operationName: "getModels",
      observer: this.observerFactory.createSilentObserver(),
    });
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    let hasMissingModel = false;

    try {
      const model = await this.gatewayChain.handle({
        operation: async (gateway) => {
          const value = await gateway.getDefaultModel(provider);
          if (typeof value !== "string") {
            hasMissingModel = true;
          }
          return value;
        },
        validate: (result) =>
          typeof result === "string" && result.trim().length > 0,
        invalidResultMessage: "Gateway retornou default model invalido",
        operationName: "getDefaultModel",
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
      operationName: "changeProvider",
      observer: this.observerFactory.createSilentObserver(),
    });

    this.gatewayChain = this.buildGatewayChain();
    return response;
  }

  async sendMessage(
    content: string,
    context?: IChatMessageContext,
  ): Promise<ISendMessageResponse> {
    const sendState = this.createSendObserverState();
    const observer = this.observerFactory.createInteractiveSendObserver(
      sendState.observerConfig,
    );

    const data = await this.gatewayChain.handle<IAssistantResponse>({
      operation: (gateway) => gateway.sendMessage(content, context),
      validate: (result) => this.assistantResponseValidator.isValid(result),
      invalidResultMessage: "Gateway retornou resposta invalida",
      operationName: "sendMessage",
      observer,
    });

    this.raiseIfTechnicalErrorPayload(data);
    const responseContent = this.responseTextExtractor.extract(data);

    if (this.isTechnicalErrorText(responseContent)) {
      const sanitized = this.sanitizeTechnicalErrorMessage(responseContent);
      throw this.errorHandler!.handle(new Error(sanitized), {
        source: ChatService.name,
        operation: "sendMessage",
        channel: "chat",
        presentToUser: true,
      });
    }

    return {
      content: responseContent,
      gatewayStatus: sendState.gatewayStatus(),
    };
  }

  private raiseIfTechnicalErrorPayload(data: IAssistantResponse): void {
    const candidates = this.collectErrorCandidates(data);
    const matched = candidates.find((candidate) =>
      this.isTechnicalErrorText(candidate),
    );
    if (!matched) return;

    const sanitizedMessage = this.sanitizeTechnicalErrorMessage(matched);
    throw this.errorHandler.handle(new Error(sanitizedMessage), {
      source: ChatService.name,
      operation: "sendMessage",
      channel: "chat",
      presentToUser: true,
    });
  }

  private collectErrorCandidates(data: IAssistantResponse): string[] {
    const values: string[] = [];
    const response = data?.response as Record<string, unknown> | undefined;

    const push = (value: unknown): void => {
      if (!value) return;
      if (typeof value === "string" && value.trim().length > 0) {
        values.push(value.trim());
      } else if (typeof value === "object" && value !== null) {
        const err = value as Record<string, unknown>;
        push(err["message"]);
        push(err["error"]);
        push(err["type"]);
        push(err["code"]);
      }
    };

    push(response?.["error"]);
    push(response?.["message"]);

    const nestedResponse = response?.["response"] as
      | Record<string, unknown>
      | string
      | undefined;
    if (nestedResponse && typeof nestedResponse === "object") {
      push(nestedResponse["error"]);
      push(nestedResponse["message"]);
    }

    return values;
  }

  private isTechnicalErrorText(text: string): boolean {
    const raw = text.trim();
    if (!raw) return false;

    const markers = [
      /^\[(UNKNOWN ERROR|QUOTA ERROR|ERROR)\]/i,
      /\bError code:\s*\d{3}\b/i,
      /\bauthentication_error\b/i,
      /\binvalid x-api-key\b/i,
      /\bdecommissioned\b/i,
      /\brate[_\s-]?limit\b/i,
      /\bquota\b/i,
      /\bunauthorized\b/i,
      /\bforbidden\b/i,
      /\binvalid[_\s-]?api[_\s-]?key\b/i,
      /\bmodel\b.+\bnot found\b/i,
    ];

    return markers.some((pattern) => pattern.test(raw));
  }

  private sanitizeTechnicalErrorMessage(raw: string): string {
    const cleaned = raw
      .replace(/^\[.*?\]\s*/i, "")
      .replace(/^\d+\s*/, "")
      .trim();

    if (/quota|rate[_\s-]?limit/i.test(cleaned)) {
      return "Limite de uso atingido. Tente novamente em instantes.";
    }

    if (
      /authentication_error|invalid x-api-key|invalid[_\s-]?api[_\s-]?key|unauthorized|forbidden/i.test(
        cleaned,
      )
    ) {
      return "Falha de autenticacao com o provedor configurado.";
    }

    if (/decommissioned|model.+not found/i.test(cleaned)) {
      return "O modelo selecionado nao esta mais disponivel.";
    }

    return "Nao foi possivel completar a operacao.";
  }

  private buildGatewayChain(): ChatGatewayChainHandler {
    return createChatGatewayChainHandler([this.httpGateway, this.coreGateway]);
  }

  private buildObserverFactory(): ChatGatewayObserverFactory {
    return new ChatGatewayObserverFactory((report) => {
      this.registerGatewayFailure(
        report.error,
        report.gatewayName,
        report.operation,
        report.details,
        report.presentToUser,
      );
    });
  }

  private hasModelList(result: unknown): result is IModelsListResponse {
    if (!result || typeof result !== "object") {
      return false;
    }

    const modelResponse = result as { models?: unknown };
    if (
      !Array.isArray(modelResponse.models) ||
      modelResponse.models.length === 0
    ) {
      return false;
    }

    const first = modelResponse.models[0];
    return (
      typeof first === "object" &&
      first !== null &&
      "id" in first &&
      "modelName" in first
    );
  }

  private createSendObserverState(): {
    observerConfig: SendMessageObserverState;
    gatewayStatus: () => string;
  } {
    let usedFallback = false;
    let status = "";

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
    presentToUser = true,
  ): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const isAuthError =
      (error instanceof HttpErrorResponse && error.status === 401) ||
      errorMsg.includes("401") ||
      errorMsg.includes("authentication_error");

    this.errorHandler?.handle(this.unwrapHandledError(error), {
      source: gatewayName,
      operation,
      details,
      channel: isAuthError
        ? "global"
        : operation === "sendMessage"
          ? "chat"
          : "global",
      presentToUser,
    });
  }

  private unwrapHandledError(error: unknown): unknown {
    return error;
  }
}

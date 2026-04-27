import { IAssistantResponse, IChangeProviderResponse, IModelsListResponse, } from '../../../../../ddd-core/application/interfaces';
import { IChatGateway, IChatMessageContext } from '../interfaces';

export class ChatGatewayChain implements IChatGateway {
  private readonly gateways: IChatGateway[];

  constructor(gateways: IChatGateway[]) {
    if (gateways.length === 0) {
      throw new Error('Pelo menos um gateway deve ser informado para montar a chain');
    }

    this.gateways = gateways;
  }

  getProviders(): Promise<string[]> {
    return this.executeWithFallback({
      operation: (gateway) => gateway.getProviders(),
      validate: (providers) => Array.isArray(providers),
      invalidResultMessage: 'Gateway retornou providers invalidos',
    });
  }

  getModels(provider?: string): Promise<IModelsListResponse> {
    return this.executeWithFallback({
      operation: (gateway) => gateway.getModels(provider),
      validate: (response) => Array.isArray(response?.models),
      invalidResultMessage: 'Gateway retornou models invalidos',
    });
  }

  async getDefaultModel(provider?: string): Promise<string | undefined> {
    let lastError: Error | null = null;
    let hasMissingModel = false;

    for (const gateway of this.gateways) {
      try {
        const model = await gateway.getDefaultModel(provider);

        if (typeof model !== 'string') {
          hasMissingModel = true;
          continue;
        }

        if (model.trim().length > 0) {
          return model;
        }

        lastError = new Error('Gateway retornou default model invalido');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    if (hasMissingModel && !lastError) {
      return undefined;
    }

    if (hasMissingModel && lastError?.message === 'Gateway retornou default model invalido') {
      return undefined;
    }

    throw lastError ?? new Error('Gateway retornou default model invalido');
  }

  changeProvider(provider: string): Promise<IChangeProviderResponse> {
    return this.executeWithFallback({
      operation: (gateway) => gateway.changeProvider(provider),
    });
  }

  sendMessage(content: string, context?: IChatMessageContext): Promise<IAssistantResponse> {
    return this.executeWithFallback({
      operation: (gateway) => gateway.sendMessage(content, context),
      validate: (response) => this.isValidAssistantResponse(response),
      invalidResultMessage: 'Gateway retornou resposta invalida',
    });
  }

  private async executeWithFallback<TResult>(context: {
    operation: (gateway: IChatGateway) => Promise<TResult>;
    validate?: (result: TResult) => boolean;
    invalidResultMessage?: string;
  }): Promise<TResult> {
    let lastError: Error | null = null;

    for (const gateway of this.gateways) {
      try {
        const result = await context.operation(gateway);

        if (context.validate && !context.validate(result)) {
          lastError = new Error(context.invalidResultMessage ?? 'Gateway retornou resposta invalida');
          continue;
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw lastError ?? new Error('Nenhum gateway disponivel');
  }

  private extractResponseText(response: IAssistantResponse): string {
    const payload = response.response;
    if (!payload) {
      return '';
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'response')
      && typeof payload.response === 'string') {
      return payload.response;
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'message')
      && typeof payload.message === 'string') {
      return payload.message;
    }

    return JSON.stringify(payload);
  }

  private isValidAssistantResponse(response: IAssistantResponse): boolean {
    if (typeof response.statusCode === 'number' && response.statusCode !== 200) {
      return false;
    }

    return this.extractResponseText(response).trim().length > 0;
  }
}

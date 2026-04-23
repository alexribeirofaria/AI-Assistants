import { CachedDomainListMixin } from '../cache/domain-list-cache';
import type { ApiResponse } from './api-response';
import { IServer } from '../../infrastructure/servers/abstracts/i-server';

export abstract class BaseDomain extends CachedDomainListMixin {
  readonly model: string;
  protected readonly modelName: string;
  protected maxTokens = 2048;

  protected constructor(
    protected readonly server: IServer,
    modelName: string
  ) {
    super();
    this.modelName = modelName;
    this.model = modelName;
  }

  static getDomainName(this: { name: string }): string {
    return this.name.replace(/Domain$/, '');
  }

  abstract buildResponseMessages(response: unknown): string;

  abstract sendMessage(prompt: string): Promise<string>;

  abstract listModels(): Promise<string[]>;

  protected async send(request: () => Promise<unknown>): Promise<string> {
    try {
      const response = await request();
      if (response == null) {
        return '[EMPTY RESPONSE]';
      }
      return this.buildResponseMessages(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.toLowerCase().includes('quota')) {
        return '[QUOTA ERROR] Limite de cota atingido';
      }
      return `[UNKNOWN ERROR] ${message}`;
    }
  }

  protected toApiResponse(response: ApiResponse): ApiResponse {
    return {
      completion_tokens: response.completion_tokens,
      total_tokens: response.total_tokens,
    };
  }
}

import { CachedDomainListMixin } from '../cache/domain-list-cache';
import { ApiResponse } from './api-response';
import { IServer } from '../../infrastructure/servers/abstracts/i-server';

export abstract class BaseDomain extends CachedDomainListMixin {
  readonly model: string;
  protected maxTokens = 2048;

  protected constructor(
    protected readonly server: IServer,
    modelName: string
  ) {
    super();
    this.model = modelName;
  }

  static getDomainName(this: { name: string }): string {
    return this.name.replace(/Domain$/, '');
  }

  abstract buildResponseMessages(response: unknown): string;

  abstract sendMessage(prompt: string): Promise<string>;

  abstract listModels(): string[];

  protected async send(request: () => Promise<unknown>): Promise<string> {
    const response = await request();
    return this.buildResponseMessages(response);
  }

  protected toApiResponse(response: ApiResponse): ApiResponse {
    return {
      completion_tokens: response.completion_tokens,
      total_tokens: response.total_tokens,
    };
  }
}

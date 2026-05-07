import { IServer } from '../../infrastructure/servers/abstracts/i-server';
import { CachedDomainListMixin } from '../cache/domain-list-cache';

export abstract class BaseDomain extends CachedDomainListMixin {
  model: string;
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

  useModel(model: string | undefined): this {
    if (model?.trim()) {
      this.model = model;
    }

    return this;
  }

  static getDomainName(): string {
    return this.name;
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

  protected responseTokens(response: any): any {
    return {
      completion_tokens: response.completion_tokens,
      total_tokens: response.total_tokens,
    };
  }
}

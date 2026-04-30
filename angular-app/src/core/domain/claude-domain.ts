
import { IServer, ModelDescriptor, TextCompletionResponse } from '../infrastructure/servers';
import { BaseDomain } from './abstracts/base-domain';

export class Claude extends BaseDomain {
  override readonly model = 'claude-3-5-haiku-20241022';

  constructor(server: IServer, modelName: string) {
    super(server, modelName);
  }

  override buildResponseMessages(response: unknown): string {
    const completion = response as TextCompletionResponse;
    if (Array.isArray(completion.content)) {
      return completion.content.map((chunk) => chunk.text || chunk.content || '').join('\n');
    }
    return String(completion.content ?? '');
  }

  override async sendMessage(prompt: string): Promise<string> {
    return this.send(() => this.server.messages!.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.maxTokens,
    }));
  }

  override async listModels(): Promise<string[]> {
    try {
      return await this.getDomainNamesCached();
    } catch (e) {
      return [`[ERROR] ${String(e)}`];
    }
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    const models = await this.server.models!.list();
    return models.data.map((model: ModelDescriptor) => model.id);
  }
}

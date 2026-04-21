import { IServer, ModelDescriptor, TextCompletionResponse } from '../infrastructure/servers/abstracts/i-server';
import { BaseDomain } from './abstracts/base-domain';

export class GroqDomain extends BaseDomain {
  override readonly model = 'llama-3.1-8b-instant';

  constructor(server: IServer, modelName: string) {
    super(server, modelName);
  }

  override buildResponseMessages(response: unknown): string {
    const completion = response as TextCompletionResponse;
    return completion.text ?? completion.choices?.[0]?.message?.content ?? '';
  }

  override async sendMessage(prompt: string): Promise<string> {
    return this.send(() => this.server.chat!.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.maxTokens,
    }));
  }

  override listModels(): string[] {
    try {
      return this._fetchDomainNames();
    } catch (e) {
      return [`[ERROR] ${String(e)}`];
    }
  }

  protected _fetchDomainNames(): string[] {
    const models = this.server.models!.list();
    return models.data.map((model: ModelDescriptor) => model.id);
  }
}

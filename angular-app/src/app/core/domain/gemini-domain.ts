import { IServer, ModelDescriptor, TextCompletionResponse } from '../infrastructure/servers/abstracts/i-server';
import { BaseDomain } from './abstracts/base-domain';

export class GeminiDomain extends BaseDomain {
  override readonly model = 'gemini-2.5-flash';
  override maxTokens = 4096;

  constructor(server: IServer, modelName: string) {
    super(server, modelName);
  }

  override buildResponseMessages(response: unknown): string {
    return (response as TextCompletionResponse).text ?? '';
  }

  override async sendMessage(prompt: string): Promise<string> {
    const geminiCall = () => this.server.chats!.create({ model: this.model }).sendMessage(prompt, { max_output_tokens: this.maxTokens });
    return this.send(geminiCall);
  }

  override listModels(): string[] {
    try {
      return this._fetchDomainNames();
    } catch (e) {
      return [`[ERROR] ${String(e)}`];
    }
  }

  protected _fetchDomainNames(): string[] {
    const models = this.server.models!.list().data;
    return models.map((model: ModelDescriptor) => model.name || model.id);
  }
}

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

  override async listModels(): Promise<string[]> {
    try {
      return await this.getDomainNamesCached();
    } catch (e) {
      return [`[ERROR] ${String(e)}`];
    }
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    const models = (await this.server.models!.list()).data;
    return models.map((model: ModelDescriptor) => model.name || model.id);
  }
}

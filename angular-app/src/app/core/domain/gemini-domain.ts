import { IServer, ModelDescriptor, TextCompletionResponse } from '../infrastructure/servers/abstracts/i-server';
import { BaseDomain } from './abstracts/base-domain';

export class Gemini extends BaseDomain {
  override readonly model = 'gemini-2.0-flash';
  override maxTokens = 4096;

  constructor(server: IServer, modelName: string) {
    super(server, modelName);
  }

  override buildResponseMessages(response: unknown): string {
    return (response as TextCompletionResponse).text ?? '';
  }

  override async sendMessage(prompt: string): Promise<string> {
    const geminiCall = () => this.server.chats!.create({ model: this.model }).sendMessage(prompt, { max_output_tokens: this.maxTokens });
    return super.send(geminiCall);
  }

  override async listModels(): Promise<string[]> {
    try {
      const models = await this.getDomainNamesCached();

      return models.map(m => this.normalizeModelName(m));

    } catch (e) {
      return [`[error] ${String(e).toLowerCase()}`];
    }
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    const models = (await this.server.models!.list()).data;
    return models.map((model: ModelDescriptor) => model.name || model.id);
  }

  private normalizeModelName(name: string): string {
  return name
    // remove conteúdo entre () e []
    .replace(/\(.*?\)|\[.*?\]/g, '')

    // remove palavras irrelevantes (opcional, pode ajustar)
    .replace(/\b(preview|latest|fast|lite|pro|tts|clip|custom tools)\b/gi, '')

    // remove caracteres especiais
    .replace(/[^a-zA-Z0-9\s.-]/g, '')

    // normaliza espaços
    .trim()
    .replace(/\s+/g, '-')

    // lowercase
    .toLowerCase();
}
}

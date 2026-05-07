import { IServer, ModelDescriptor, TextCompletionResponse } from '../infrastructure/servers/abstracts/i-server';
import { BaseDomain } from './abstracts/base-domain';

export class Groq extends BaseDomain {
  override readonly model = 'llama-3.1-8b-instant';

  constructor(server: IServer, modelName: string) {
    super(server, modelName);
  }

  override buildResponseMessages(response: unknown): string {
    const completion = response as TextCompletionResponse;
    const fromChoices = completion.choices?.[0]?.message?.content;
    if (typeof fromChoices === 'string' && fromChoices.trim()) {
      return fromChoices;
    }

    if (typeof completion.text === 'string' && completion.text.trim()) {
      return completion.text;
    }

    if (Array.isArray(completion.content)) {
      const joined = completion.content
        .map((chunk) => chunk.text ?? chunk.content ?? '')
        .join('\n')
        .trim();
      if (joined) {
        return joined;
      }
    }

    if (typeof completion.content === 'string' && completion.content.trim()) {
      return completion.content;
    }

    return '[EMPTY RESPONSE]';
  }

  override async sendMessage(prompt: string): Promise<string> {
    const completions = this.server.chat?.completions;
    if (!completions) {
      return '[CLIENT ERROR] API de chat não está disponível para o provider Groq';
    }

    return await this.send(() => completions.create({
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

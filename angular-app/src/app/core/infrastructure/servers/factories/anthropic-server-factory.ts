import Anthropic from '@anthropic-ai/sdk';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class AnthropicServerFactory extends BaseServerFactory {
  private readonly fallbackModels: ModelDescriptor[] = [
    { id: 'claude-haiku-4-5-20251001' },
  ];

  buildServer(): IServer {
    const apiKey = this.requireEnv('LLM_CLAUDE_API_KEY', 'Claude API key não encontrada no .env');
    const client = new Anthropic({ apiKey });

    return {
      messages: {
        create: async (params): Promise<TextCompletionResponse> => client.messages.create(params),
      },
      models: {
        list: async () => {
          try {
            const page = await client.beta.models.list();
            return {
              data: page.data.map((model) => ({
                id: model.id,
                name: model.display_name,
              })),
            };
          } catch {
            return { data: this.fallbackModels };
          }
        },
      },
    };
  }
}

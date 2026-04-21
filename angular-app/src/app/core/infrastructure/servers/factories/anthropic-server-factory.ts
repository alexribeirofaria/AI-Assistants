import { IServer, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class AnthropicServerFactory extends BaseServerFactory {
  buildServer(): IServer {
    const apiKey: string = this.requireEnv('LLM_CLAUDE_API_KEY', 'Claude API key não encontrada no .env');
    return {
      messages: {
        create: async ({ model }): Promise<TextCompletionResponse> => ({
          model,
          content: [{ text: `[mock:${apiKey}]` }],
        }),
      },
      models: {
        list: () => ({
          data: [{ id: 'claude-haiku-4-5-20251001' }],
        }),
      },
    };
  }
}

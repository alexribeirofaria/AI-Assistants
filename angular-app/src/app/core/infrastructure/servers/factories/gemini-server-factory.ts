import { IServer, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class GeminiServerFactory extends BaseServerFactory {
  buildServer(): IServer {
    const apiKey: string = this.requireEnv('LLM__gemini-API_KEY', 'Gemini API key não encontrada no .env');
    return {
      chats: {
        create: ({ model }) => ({
          sendMessage: async (): Promise<TextCompletionResponse> => ({
            model,
            text: `[mock:${apiKey}]`,
          }),
        }),
      },
      models: {
        list: () => ({
          data: [{ id: 'gemini-2.5-flash', name: 'gemini-2.5-flash' }],
        }),
      },
    };
  }
}

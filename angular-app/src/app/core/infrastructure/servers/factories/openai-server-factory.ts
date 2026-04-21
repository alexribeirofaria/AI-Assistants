import { IServer, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class OpenAIServerFactory extends BaseServerFactory {
  buildServer(): IServer {
    const apiKey: string = this.requireEnv('LLM__OPEN_API_KEY', 'OpenAI API key não encontrada no .env');
    const timeout: number = this.optionalFloatEnv('LLM__OPENAI_TIMEOUT_SECONDS', 30.0);
    const maxRetries: number = this.optionalIntEnv('LLM__OPENAI_MAX_RETRIES', 1);

    return {
      chat: {
        completions: {
          create: async ({ model }): Promise<TextCompletionResponse> => ({
            model,
            choices: [{ message: { content: `[mock:${apiKey}:${timeout}:${maxRetries}]` } }],
          }),
        },
      },
      models: {
        list: () => ({
          data: [{ id: 'gpt-3.5-turbo' }, { id: 'gpt-4o-mini' }],
        }),
      },
    };
  }
}

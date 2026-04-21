import { IServer, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class GroqServerFactory extends BaseServerFactory {
  buildServer(): IServer {
    const apiKey: string = this.requireEnv('LLM__GROQ_API_KEY', 'Groq API key não encontrada no .env');
    const baseUrl: string = this.optionalEnv('LLM__GROQ_BASE_URL', 'https://api.groq.com/openai/v1');
    const timeout: number = this.optionalFloatEnv('LLM__GROQ_TIMEOUT_SECONDS', 30.0);
    const maxRetries: number = this.optionalIntEnv('LLM__GROQ_MAX_RETRIES', 1);

    return {
      chat: {
        completions: {
          create: async ({ model }): Promise<TextCompletionResponse> => ({
            model,
            choices: [{ message: { content: `[mock:${apiKey}:${baseUrl}:${timeout}:${maxRetries}]` } }],
          }),
        },
      },
      models: {
        list: () => ({
          data: [{ id: 'llama-3.1-8b-instant' }],
        }),
      },
    };
  }
}

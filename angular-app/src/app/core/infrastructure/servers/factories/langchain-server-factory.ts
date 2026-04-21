import { IServer, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class LangChainServerFactory extends BaseServerFactory {
  buildServer(): IServer {
    const model: string = 'llama3-70b-8192';
    const apiKey: string = this.requireEnv('LLM__GROQ_API_KEY', 'LangChain API key não encontrada no .env');
    const timeout: number = this.optionalFloatEnv('LLM__TIMEOUT_SECONDS', 30.0);
    const maxRetries: number = this.optionalIntEnv('LLM__MAX_RETRIES', 1);

    return {
      invoke: async (): Promise<TextCompletionResponse> => ({
        model,
        text: `[mock:${apiKey}:${timeout}:${maxRetries}]`,
      }),
      models: {
        list: () => ({
          data: [{ id: model }],
        }),
      },
    };
  }
}

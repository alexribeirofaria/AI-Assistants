import OpenAI from 'openai';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class OpenAIServerFactory extends BaseServerFactory {
  private readonly fallbackModels: ModelDescriptor[] = [
    { id: 'gpt-3.5-turbo' },
    { id: 'gpt-4o-mini' },
  ];

  buildServer(): IServer {
    const apiKey = this.requireEnv('LLM__OPEN_API_KEY', 'OpenAI API key não encontrada no .env');
    const timeoutSeconds = this.optionalFloatEnv('LLM__OPENAI_TIMEOUT_SECONDS', 30.0);
    const maxRetries = this.optionalIntEnv('LLM__OPENAI_MAX_RETRIES', 1);
    const client = new OpenAI({
      apiKey,
      timeout: timeoutSeconds * 1000,
      maxRetries,
    });

    return {
      chat: {
        completions: {
          create: async (params): Promise<TextCompletionResponse> => client.chat.completions.create(params),
        },
      },
      models: {
        list: async () => {
          const page = await client.models.list();
          return {
            data: page.data.map((model) => ({ id: model.id })),
          };
        },
      },
    };
  }
}

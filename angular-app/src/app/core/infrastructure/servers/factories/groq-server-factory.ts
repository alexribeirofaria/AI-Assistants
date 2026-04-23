import OpenAI from 'openai';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class GroqServerFactory extends BaseServerFactory {
  private readonly fallbackModels: ModelDescriptor[] = [
    { id: 'llama-3.1-8b-instant' },
  ];

  buildServer(): IServer {
    const apiKey = this.requireEnv('LLM__GROQ_API_KEY', 'Groq API key não encontrada no .env');
    const baseURL = this.optionalEnv('LLM__GROQ_BASE_URL', 'https://api.groq.com/openai/v1');
    const timeoutSeconds = this.optionalFloatEnv('LLM__GROQ_TIMEOUT_SECONDS', 30.0);
    const maxRetries = this.optionalIntEnv('LLM__GROQ_MAX_RETRIES', 1);
    const client = new OpenAI({
      apiKey,
      baseURL,
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
          try {
            const page = await client.models.list();
            return {
              data: page.data.map((model) => ({ id: model.id })),
            };
          } catch {
            return { data: this.fallbackModels };
          }
        },
      },
    };
  }
}

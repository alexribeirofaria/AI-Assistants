import { ChatOpenAI } from '@langchain/openai';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class LangChainServerFactory extends BaseServerFactory {
  private readonly model = 'llama3-70b-8192';
  private readonly fallbackModels: ModelDescriptor[] = [
    { id: 'llama3-70b-8192' },
    { id: 'mixtral-8x7b' },
  ];

  buildServer(): IServer {
    const apiKey = this.requireEnv('LLM__GROQ_API_KEY', 'LangChain API key não encontrada no .env');
    const timeoutSeconds = this.optionalFloatEnv('LLM__TIMEOUT_SECONDS', 30.0);
    const maxRetries = this.optionalIntEnv('LLM__MAX_RETRIES', 1);
    const client = new ChatOpenAI({
      apiKey,
      model: this.model,
      configuration: {
        baseURL: 'https://api.groq.com/openai/v1',
      },
      timeout: timeoutSeconds * 1000,
      maxRetries,
    });

    return {
      invoke: async (messages): Promise<TextCompletionResponse> => {
        const response = await client.invoke(messages.map((message) => message.content).join('\n'));

        return {
          model: this.model,
          text: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
        };
      },
      models: {
        list: async () => ({ data: this.fallbackModels }),
      },
    };
  }
}

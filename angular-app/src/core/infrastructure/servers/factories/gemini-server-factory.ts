import { GoogleGenAI } from '@google/genai';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class GeminiServerFactory extends BaseServerFactory {
  private readonly fallbackModels: ModelDescriptor[] = [
    { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash' },
  ];

  buildServer(): IServer {
    const apiKey = this.requireEnv('LLM__GEMINI_API_KEY', 'Gemini API key não encontrada no .env');
    const client = new GoogleGenAI({ apiKey });

    return {
      chats: {
        create: ({ model }) => {
          const chat = client.chats.create({ model });

          return {
            sendMessage: async (prompt, config): Promise<TextCompletionResponse> => {
              const response = await chat.sendMessage({
                message: prompt,
                config: { maxOutputTokens: config.max_output_tokens },
              });

              return {
                model,
                text: response.text,
              };
            },
          };
        },
      },
      models: {
        list: async () => {
          try {
            const pager = await client.models.list();
            const data: ModelDescriptor[] = [];

            for await (const model of pager) {
              const name = model.name?.replace(/^models\//, '') || model.displayName;
              if (!name) {
                continue;
              }

              data.push({
                id: name,
                name: model.displayName || name,
              });

              if (data.length >= 50) {
                break;
              }
            }

            return { data: data.length > 0 ? data : this.fallbackModels };
          } catch {
            return { data: this.fallbackModels };
          }
        },
      },
    };
  }
}

import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

export class AnthropicServerFactory extends BaseServerFactory {
  private readonly fallbackModels: ModelDescriptor[] = [
    { id: 'claude-3-5-haiku-20241022' },
  ];

  buildServer(): IServer {
    const apiKey = this.requireEnv('LLM_CLAUDE_API_KEY', 'Claude API key não encontrada no .env');
    const client = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    return {
      messages: {
        create: async (params): Promise<TextCompletionResponse> => {
          const response = await client.messages.create({
            model: params.model,
            max_tokens: params.max_tokens ?? 2048,
            messages: params.messages.map((message): MessageParam => ({
              role: message.role === 'assistant' ? 'assistant' : 'user',
              content: message.content,
            })),
          });
          return {
            model: response.model,
            content: response.content
              .filter((block) => block.type === 'text')
              .map((block) => ({ text: block.text })),
          };
        },
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

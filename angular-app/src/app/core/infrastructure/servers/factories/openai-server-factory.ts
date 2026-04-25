import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { IServer, ModelDescriptor, TextCompletionResponse } from '../abstracts/i-server';
import { BaseServerFactory } from './abstracts/base-server-factory';

type SupportedChatRole = 'system' | 'user' | 'assistant' | 'developer';
type SupportedChatMessage = Extract<ChatCompletionMessageParam, { role: SupportedChatRole }>;

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
      dangerouslyAllowBrowser: true,
      timeout: timeoutSeconds * 1000,
      maxRetries,
    });

    return {
      chat: {
        completions: {
          create: async (params): Promise<TextCompletionResponse> => {
            const response = await client.chat.completions.create({
              model: params.model,
              messages: params.messages.map((message): SupportedChatMessage => this.toChatMessage(message.role, message.content)),
              max_tokens: params.max_tokens,
            });

            return {
              model: response.model,
              choices: response.choices.map((choice) => ({
                message: {
                  content: this.normalizeMessageContent(choice.message.content),
                },
              })),
            };
          },
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

  private toChatMessage(role: string, content: string): SupportedChatMessage {
    const normalizedRole: SupportedChatRole = this.isSupportedRole(role) ? role : 'user';
    return { role: normalizedRole, content };
  }

  private isSupportedRole(role: string): role is SupportedChatRole {
    return role === 'system' || role === 'user' || role === 'assistant' || role === 'developer';
  }

  private normalizeMessageContent(content: unknown): string {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((part) => {
          if (typeof part === 'string') {
            return part;
          }
          if (part && typeof part === 'object' && 'text' in part) {
            const text = (part as { text?: unknown }).text;
            return typeof text === 'string' ? text : '';
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');
    }

    return '';
  }
}

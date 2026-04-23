import { IServer, ModelDescriptor, TextCompletionResponse } from '../infrastructure/servers/abstracts';
import { BaseDomain } from './abstracts/base-domain';

export class LangChainDomain extends BaseDomain {
  override readonly model = 'gpt-3.5-turbo';
  private readonly availableModels = [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4.1',
    'gpt-3.5-turbo',
    'llama3-70b-8192',
    'mixtral-8x7b',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'claude-3-haiku',
    'claude-3-sonnet',
  ];

  constructor(server: IServer, modelName: string) {
    super(server, modelName);
  }

  override buildResponseMessages(response: unknown): string {
    const completion = response as TextCompletionResponse;
    return completion.text ?? completion.choices?.[0]?.message?.content ?? '';
  }

  override async sendMessage(prompt: string): Promise<string> {
    return this.send(() => {
      if (!this.server.invoke) {
        throw new Error('LangChain server does not implement invoke');
      }
      return this.server.invoke([{ role: 'human', content: prompt }]);
    });
  }

  override async listModels(): Promise<string[]> {
    try {
      return await this.getDomainNamesCached();
    } catch (e) {
      return [`[ERROR] ${String(e)}`];
    }
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    return this.availableModels;
  }
}

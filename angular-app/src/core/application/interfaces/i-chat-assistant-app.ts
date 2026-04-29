import { IAssistantResponse } from './i-assistant-response';
import { IChangeProviderResponse } from './i-change-provider-response';
import { IModelsListResponse } from './i-models-list-response';

export interface IChatAssistantApp {
  getInputPrompt(): string;
  getProviders(): Promise<string[]>;
  listModels(provider?: string, searchQuery?: string, prefix?: string): Promise<IModelsListResponse>;
  getDefaultModel(provider?: string): Promise<string>;
  changeProvider(provider: string): Promise<IChangeProviderResponse>;
  sendMessage(content: string): Promise<IAssistantResponse>;
  selectModel(model?: string): void;
  runApp(): void;
  processInput(input: string): Promise<boolean>;
}

import { IAssistantResponse, IChangeProviderResponse, IModelsListResponse } from '../../../../../ddd-core/application/interfaces';
import { IChatMessageContext } from './i-chat-message-context';

export interface IChatGateway {
  getProviders(): Promise<string[]>;
  getModels(provider?: string): Promise<IModelsListResponse>;
  getDefaultModel(provider?: string): Promise<string | undefined>;
  changeProvider(provider: string): Promise<IChangeProviderResponse>;
  sendMessage(content: string, context?: IChatMessageContext): Promise<IAssistantResponse>;
}

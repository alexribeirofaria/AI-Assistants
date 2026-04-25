import {
  IAssistantResponse,
  IChangeProviderResponse,
  IModelsListResponse,
} from '../../../../core/application/interfaces';

export interface IChatGateway {
  getProviders(): Promise<string[]>;
  getModels(provider?: string): Promise<IModelsListResponse>;
  getDefaultModel(provider?: string): Promise<string | undefined>;
  changeProvider(provider: string): Promise<IChangeProviderResponse>;
  sendMessage(content: string): Promise<IAssistantResponse>;
}

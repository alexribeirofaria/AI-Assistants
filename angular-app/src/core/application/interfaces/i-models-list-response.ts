import { IChatModel } from './i-chat-model';

export interface IModelsListResponse {
  defaultModel?: string;
  models: IChatModel[];
}

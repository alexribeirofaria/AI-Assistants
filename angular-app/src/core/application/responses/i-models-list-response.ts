import { IChatModel } from '../interfaces/i-chat-model';

export interface IModelsListResponse {
  defaultModel?: string;
  models: IChatModel[];
}

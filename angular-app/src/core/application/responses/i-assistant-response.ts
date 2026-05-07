import { IAssistantResponseData } from './i-assistant-response-data';

export interface IAssistantResponse {
  input: string;
  statusCode?: number;
  response?: IAssistantResponseData;
}

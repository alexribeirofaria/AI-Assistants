export interface IAssistantResponseData {
  names?: string[];
  header?: string;
  message?: string;
  model?: string;
  response?: string;
}

export interface IAssistantResponse {
  input: string;
  statusCode?: number;
  response?: IAssistantResponseData;
}

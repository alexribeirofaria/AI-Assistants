export interface IProviderListResponse {
  providers: string[];
}

export interface IModelResponse {
  id: string;
  modelName: string;
  provider: string;
}

export interface IModelsListResponse {
  models: IModelResponse[];
}

export interface IAssistantResponseData {
  names?: string[];
  header?: string;
  message?: string;
  model?: string;
  response?: string;
}

export interface IAssistantResponse {
  input: string;
  response?: IAssistantResponseData;
}

export interface IChangeProviderResponse {
  status: string;
}

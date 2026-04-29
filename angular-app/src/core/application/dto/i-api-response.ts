export interface IApiResponse {
  completion_tokens?: number;
  total_tokens?: number;
  text?: string;
  model?: string;
  id?: string;
  created?: number;
}

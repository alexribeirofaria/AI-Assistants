import { IAssistantResponse } from "../../application/interfaces";

export class ResponseTextExtractor {
  extract(data: IAssistantResponse): string {
    const response = data?.response;

    if (!response) return '';

    if (typeof response.response === 'string') {
      return response.response;
    }

    if (typeof response.message === 'string') {
      return response.message;
    }

    return JSON.stringify(response);
  }
}

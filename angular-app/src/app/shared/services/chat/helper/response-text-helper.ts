import { IAssistantResponse } from "../../../../ddd-core/application/interfaces";

export class ResponseTextHelper {
  static extract(data: IAssistantResponse): string {
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

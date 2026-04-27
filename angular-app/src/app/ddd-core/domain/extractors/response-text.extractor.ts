import { IAssistantResponse } from "../../application/interfaces";

export class ResponseTextExtractor {
  extract(data: IAssistantResponse): string {
    const response = data?.response;

    if (!response) return '';

    const nestedResponse = (response as { response?: unknown }).response;
    if (typeof nestedResponse === 'string') {
      return nestedResponse;
    }

    const formattedNestedList = this.tryFormatModelListPayload(nestedResponse);
    if (formattedNestedList) {
      return formattedNestedList;
    }

    const message = (response as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }

    const formattedList = this.tryFormatModelListPayload(response);
    if (formattedList) {
      return formattedList;
    }

    return JSON.stringify(response);
  }

  private tryFormatModelListPayload(payload: unknown): string | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    const candidate = payload as {
      header?: unknown;
      names?: unknown;
      prefix?: unknown;
    };

    if (typeof candidate.header !== 'string') {
      return undefined;
    }

    if (!Array.isArray(candidate.names)) {
      return undefined;
    }

    const names = candidate.names.filter((name): name is string => typeof name === 'string' && name.trim().length > 0);
    if (names.length === 0) {
      return undefined;
    }

    const prefix = typeof candidate.prefix === 'string' ? candidate.prefix : '- ';
    return `${candidate.header}\n${names.map((name) => `${prefix}${name}`).join('\n')}`;
  }
}

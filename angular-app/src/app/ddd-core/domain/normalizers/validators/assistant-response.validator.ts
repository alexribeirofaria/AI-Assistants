import { IAssistantResponse } from "../../../application/interfaces";
import { ResponseTextExtractor } from "../../extractors/response-text.extractor";

export class AssistantResponseValidator {
  private readonly responseTextExtractor: ResponseTextExtractor;

  constructor(responseTextExtractor: ResponseTextExtractor = new ResponseTextExtractor()) {
    this.responseTextExtractor = responseTextExtractor;
  }

  public isValid(result: IAssistantResponse): boolean {
    if (!result) return false;

    if (this.hasLegacyStatusError(result)) return false;
    if (this.hasHttpError(result)) return false;
    if (this.hasApiError(result)) return false;

    return this.hasContent(result);
  }

  private hasLegacyStatusError(result: IAssistantResponse): boolean {
    const status = (result as unknown as { status?: unknown }).status;
    return typeof status === 'number' && status >= 400;
  }

  private hasHttpError(result: IAssistantResponse): boolean {
    return typeof result.statusCode === 'number' && result.statusCode !== 200;
  }

  private hasApiError(result: IAssistantResponse): boolean {
    const response = result.response as { error?: unknown; response?: unknown } | undefined;
    if (!response || typeof response !== 'object') {
      return false;
    }

    const directError = response.error;
    if (typeof directError === 'string' && directError.trim().length > 0) {
      return true;
    }

    const nested = response.response as { error?: unknown } | undefined;
    return typeof nested?.error === 'string' && nested.error.trim().length > 0;
  }

  private hasContent(result: IAssistantResponse): boolean {
    return this.responseTextExtractor.extract(result).trim().length > 0;
  }
}

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

    if (this.isErrorObject(response.error)) {
      return true;
    }

    const nested = response.response as { error?: unknown } | undefined;
    return this.isErrorObject(nested?.error);
  }

  private isErrorObject(error: unknown): boolean {
    if (!error) return false;
    if (typeof error === 'string' && error.trim().length > 0) return true;
    if (typeof error === 'object' && error !== null) {
      // Common structures like { message: '...', code: '...' } or { type: '...', error: { ... } }
      const err = error as Record<string, unknown>;
      return 'message' in err || 'type' in err || 'error' in err || 'code' in err;
    }
    return false;
  }

  private hasContent(result: IAssistantResponse): boolean {
    return this.responseTextExtractor.extract(result).trim().length > 0;
  }
}

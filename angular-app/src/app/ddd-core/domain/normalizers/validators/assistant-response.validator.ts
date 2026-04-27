import { IAssistantResponse } from "../../../application/interfaces";
import { ResponseTextExtractor } from "../../extractors/response-text.extractor";

export class AssistantResponseValidator {
  public isValid(result: IAssistantResponse): boolean {
    if (!result) return false;

    if (this.hasHttpError(result)) return false;
    if (this.hasApiError(result)) return false;

    return this.hasContent(result);
  }

  private hasHttpError(result: IAssistantResponse): boolean {
    return typeof result.statusCode === 'number' && result.statusCode !== 200;
  }

  private hasApiError(result: IAssistantResponse): boolean {
    const response = result.response as any;
    return typeof response?.error === 'string' && response.error.trim().length > 0;
  }

  private hasContent(result: IAssistantResponse): boolean {
    return this.extractText(result).trim().length > 0;
  }

  private extractText(result: IAssistantResponse): string {
    return new ResponseTextExtractor().extract(result);
  }
}

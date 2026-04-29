import { IAssistantResponse } from '../../../application/interfaces';
import { ResponseTextExtractor } from '../../../domain/extractors/response-text.extractor';

export class ResponseTextHelper {
  private static readonly extractor = new ResponseTextExtractor();

  static extract(data: IAssistantResponse): string {
    return this.extractor.extract(data);
  }
}

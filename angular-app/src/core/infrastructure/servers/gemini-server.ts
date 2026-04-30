import { BaseServer } from './abstracts/base-server';
import { GeminiServerFactory } from './factories/gemini-server-factory';

export class GeminiServer extends BaseServer {
  createFactory(): GeminiServerFactory {
    return new GeminiServerFactory();
  }
}

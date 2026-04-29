import { BaseServer } from './abstracts/base-server';
import { OpenAIServerFactory } from './factories/openai-server-factory';

export class OpenAIServer extends BaseServer {
  createFactory(): OpenAIServerFactory {
    return new OpenAIServerFactory();
  }
}

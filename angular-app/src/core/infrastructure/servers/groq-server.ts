import { BaseServer } from './abstracts/base-server';
import { GroqServerFactory } from './factories/groq-server-factory';

export class GroqServer extends BaseServer {
  createFactory(): GroqServerFactory {
    return new GroqServerFactory();
  }
}

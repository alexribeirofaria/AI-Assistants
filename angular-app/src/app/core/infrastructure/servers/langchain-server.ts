import { BaseServer } from './abstracts/base-server';
import { LangChainServerFactory } from './factories/langchain-server-factory';

export class LangChainServer extends BaseServer {
  createFactory(): LangChainServerFactory {
    return new LangChainServerFactory();
  }
}

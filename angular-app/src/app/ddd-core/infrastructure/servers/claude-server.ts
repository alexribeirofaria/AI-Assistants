import { BaseServer } from './abstracts/base-server';
import { AnthropicServerFactory } from './factories/anthropic-server-factory';

export class ClaudeServer extends BaseServer {
  createFactory(): AnthropicServerFactory {
    return new AnthropicServerFactory();
  }
}

import { AnthropicServerFactory } from './anthropic_server_factory';

describe('AnthropicServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new AnthropicServerFactory();
    expect(instance).toBeTruthy();
  });
});

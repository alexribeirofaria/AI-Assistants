import { GroqServerFactory } from './groq_server_factory';

describe('GroqServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new GroqServerFactory();
    expect(instance).toBeTruthy();
  });
});

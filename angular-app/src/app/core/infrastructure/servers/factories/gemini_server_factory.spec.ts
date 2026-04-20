import { GeminiServerFactory } from './gemini_server_factory';

describe('GeminiServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new GeminiServerFactory();
    expect(instance).toBeTruthy();
  });
});

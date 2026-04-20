import { GeminiServer } from './gemini_server';

describe('GeminiServer', () => {
  it('should be instantiated', () => {
    const instance = new GeminiServer();
    expect(instance).toBeTruthy();
  });
});

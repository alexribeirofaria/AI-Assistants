import { GroqServer } from './groq_server';

describe('GroqServer', () => {
  it('should be instantiated', () => {
    const instance = new GroqServer();
    expect(instance).toBeTruthy();
  });
});

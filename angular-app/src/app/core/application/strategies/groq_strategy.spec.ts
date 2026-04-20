import { GroqStrategy } from './groq_strategy';

describe('GroqStrategy', () => {
  it('should be instantiated', () => {
    const instance = new GroqStrategy();
    expect(instance).toBeTruthy();
  });
});

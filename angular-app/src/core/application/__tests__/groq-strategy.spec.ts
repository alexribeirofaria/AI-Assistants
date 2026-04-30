import { GroqStrategy } from '../strategies/groq-strategy';

describe('GroqStrategy', () => {
  it('binds the Groq domain', () => {
    expect(new GroqStrategy().domainClass.name).toBe('Groq');
  });
});

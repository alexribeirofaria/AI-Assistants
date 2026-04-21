import { GeminiStrategy } from '../strategies/gemini-strategy';

describe('GeminiStrategy', () => {
  it('binds the Gemini domain', () => {
    expect(new GeminiStrategy().domainClass.name).toBe('GeminiDomain');
  });
});

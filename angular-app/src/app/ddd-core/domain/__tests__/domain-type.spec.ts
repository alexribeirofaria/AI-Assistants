import { DomainType } from '../abstracts/domain-type';

describe('DomainType', () => {
  it('should have all expected enum values', () => {
    expect(DomainType.Claude).toBe('Claude');
    expect(DomainType.OpenAI).toBe('Open AI');
    expect(DomainType.Gemini).toBe('Gemini');
    expect(DomainType.Groq).toBe('Groq');
    expect(DomainType.LangChain).toBe('Lang Chain');
  });

  it('should have correct number of values', () => {
    expect(Object.keys(DomainType).length).toBe(5);
  });
});

import { OpenAIStrategy } from '../strategies/openai-strategy';

describe('OpenAIStrategy', () => {
  it('binds the OpenAI domain', () => {
    expect(new OpenAIStrategy().domainClass.name).toBe('OpenAI');
  });
});

import { DecoratorTextHelper } from '../decorator/helpers/decorator-text-helper';

describe('DecoratorTextHelper', () => {
  it('normalizes and matches text', () => {
    expect(DecoratorTextHelper.normalizeText('  OpenAI!! GPT-4  ')).toBe('openai gpt 4');
    expect(DecoratorTextHelper.bestMatch('open ai', ['openai', 'gemini'], 0.5)).toBe('openai');
  });
});

import { OpenaiStrategy } from './openai_strategy';

describe('OpenaiStrategy', () => {
  it('should be instantiated', () => {
    const instance = new OpenaiStrategy();
    expect(instance).toBeTruthy();
  });
});

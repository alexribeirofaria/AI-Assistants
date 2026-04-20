import { LangchainStrategy } from './langchain_strategy';

describe('LangchainStrategy', () => {
  it('should be instantiated', () => {
    const instance = new LangchainStrategy();
    expect(instance).toBeTruthy();
  });
});

import { LangChainStrategy } from '../strategies/langchain-strategy';

describe('LangChainStrategy', () => {
  it('binds the LangChain domain', () => {
    expect(new LangChainStrategy().domainClass.name).toBe('LangChain');
  });
});

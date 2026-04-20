import { LangchainServer } from './langchain_server';

describe('LangchainServer', () => {
  it('should be instantiated', () => {
    const instance = new LangchainServer();
    expect(instance).toBeTruthy();
  });
});

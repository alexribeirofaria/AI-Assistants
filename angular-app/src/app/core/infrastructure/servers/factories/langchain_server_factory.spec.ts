import { LangchainServerFactory } from './langchain_server_factory';

describe('LangchainServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new LangchainServerFactory();
    expect(instance).toBeTruthy();
  });
});

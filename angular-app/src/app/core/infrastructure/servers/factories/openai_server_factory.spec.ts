import { OpenaiServerFactory } from './openai_server_factory';

describe('OpenaiServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new OpenaiServerFactory();
    expect(instance).toBeTruthy();
  });
});

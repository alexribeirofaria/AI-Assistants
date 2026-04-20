import { OpenaiServer } from './openai_server';

describe('OpenaiServer', () => {
  it('should be instantiated', () => {
    const instance = new OpenaiServer();
    expect(instance).toBeTruthy();
  });
});

import { BaseServer } from './base_server';

describe('BaseServer', () => {
  it('should be instantiated', () => {
    const instance = new BaseServer();
    expect(instance).toBeTruthy();
  });
});

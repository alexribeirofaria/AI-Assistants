import { BaseServerFactory } from './base_server_factory';

describe('BaseServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new BaseServerFactory();
    expect(instance).toBeTruthy();
  });
});

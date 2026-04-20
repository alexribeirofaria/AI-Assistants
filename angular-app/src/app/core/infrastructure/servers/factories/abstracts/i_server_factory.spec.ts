import { IServerFactory } from './i_server_factory';

describe('IServerFactory', () => {
  it('should be instantiated', () => {
    const instance = new IServerFactory();
    expect(instance).toBeTruthy();
  });
});

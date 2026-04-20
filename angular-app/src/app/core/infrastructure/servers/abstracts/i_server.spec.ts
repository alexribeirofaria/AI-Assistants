import { IServer } from './i_server';

describe('IServer', () => {
  it('should be instantiated', () => {
    const instance = new IServer();
    expect(instance).toBeTruthy();
  });
});

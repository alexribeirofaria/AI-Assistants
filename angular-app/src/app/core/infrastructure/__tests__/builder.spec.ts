import { BaseServer } from '../servers/abstracts/base-server';
import { Builder } from '../repository/builder';

describe('Builder', () => {
  it('uses the injected server when provided', () => {
    const server = {} as BaseServer;
    const instance = new Builder(server);
    expect(instance.server).toBe(server);
  });
});

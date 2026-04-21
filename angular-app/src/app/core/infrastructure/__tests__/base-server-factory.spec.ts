import { BaseServerFactory } from '../servers/factories/abstracts/base-server-factory';
import { IServer } from '../servers/abstracts/i-server';

class TestFactory extends BaseServerFactory {
  buildServer(): IServer {
    return {} as IServer;
  }

  readRequired(name: string): string {
    return this.requireEnv(name, 'missing');
  }
}

describe('BaseServerFactory', () => {
  it('throws when a required value is missing', () => {
    const factory = new TestFactory();
    expect(() => factory.readRequired('UNKNOWN_ENV')).toThrowError('missing');
  });
});

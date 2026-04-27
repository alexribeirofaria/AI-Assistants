import { BaseServer } from '../servers/abstracts/base-server';
import { BaseServerFactory } from '../servers/factories/abstracts/base-server-factory';
import { IServer } from '../servers/abstracts/i-server';

class TestServerFactory extends BaseServerFactory {
  buildServer(): IServer {
    return { models: { list: async () => ({ data: [] }) } } as IServer;
  }
}

class TestServer extends BaseServer {
  createFactory(): BaseServerFactory {
    return new TestServerFactory();
  }
}

describe('BaseServer Unit Tests', () => {
  it('loads a server on construction and returns it from loadServer', () => {
    const server = new TestServer();

    expect(server.loadServer()).toBeTruthy();
    expect(server.loadServer().models).toBeTruthy();
  });
});

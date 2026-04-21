import { IServer } from './i-server';
import { BaseServerFactory } from '../factories/abstracts/base-server-factory';

export abstract class BaseServer {
  protected server!: IServer;

  constructor() {
    const factory = this.createFactory();
    this.server = factory.buildServer();
  }

  abstract createFactory(): BaseServerFactory;

  loadServer(): IServer {
    return this.server;
  }
}

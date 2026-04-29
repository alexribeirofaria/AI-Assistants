import { DomainConstructor } from '../../application/strategies/abstracts/base-application-strategy';
import { BaseDomain } from '../../domain/abstracts/base-domain';
import { BaseServer } from '../servers/abstracts/base-server';

export class Builder {
  private _server: BaseServer | null = null;

  constructor(
    private readonly domainClass: DomainConstructor,
    private readonly serverFactory?: () => BaseServer,
    serverInstance: BaseServer | null = null
  ) {
    this._server = serverInstance;
  }

  get server(): BaseServer {
    if (!this._server) {
      if (!this.serverFactory) {
        throw new Error('Builder: serverFactory ou serverInstance deve ser fornecido');
      }
      this._server = this.serverFactory();
    }
    return this._server;
  }

  buildDomain(): BaseDomain {
    return new this.domainClass(this.server.loadServer(), this.domainClass.getDomainName());
  }
}

import { BaseDomain } from '../../../../domain/abstracts/base-domain';
import { BaseServer } from '../../../servers/abstracts/base-server';
import { Builder } from '../../builder';
import { BaseRepositoryStrategy } from './abstracts/base-repository-strategy';

export class RepositoryStrategy implements BaseRepositoryStrategy {
  constructor(
    private _domain: BaseDomain,
    private _builder: Builder
  ) {}

  buildDomain(): BaseDomain {
    return this._domain;
  }

  get server(): BaseServer {
    return this._builder.server;
  }
}

import { BaseDomain } from '../../../domain';
import { Builder } from '../builder';
import { BaseRepositoryStrategy } from './abstracts/base-repository-strategy';

export class RepositoryStrategy implements BaseRepositoryStrategy {
  constructor(private readonly builder: Builder) {}

  buildDomain(): BaseDomain {
    return this.builder.buildDomain();
  }
}

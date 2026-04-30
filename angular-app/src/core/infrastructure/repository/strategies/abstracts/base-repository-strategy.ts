import { BaseDomain } from '../../../../domain/abstracts/base-domain';

export abstract class BaseRepositoryStrategy {
  abstract buildDomain(): BaseDomain;
}

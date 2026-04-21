import { BaseDomain } from '../../../../domain/abstracts/base-domain';
import { BaseApplicationStrategy, DomainConstructor } from '../../abstracts/base-application-strategy';

export interface InterfaceApplicationFactory {
  getStrategy(name: string | DomainConstructor<BaseDomain> | null): BaseApplicationStrategy;
}

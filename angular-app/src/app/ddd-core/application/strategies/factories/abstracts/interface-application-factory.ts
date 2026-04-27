import { BaseDomain } from '../../../../domain/abstracts/base-domain';
import { BaseApplicationStrategy, DomainConstructor } from '../../abstracts/base-application-strategy';

export interface IApplicationStrategyFactory {
  getStrategy(name: string | DomainConstructor<BaseDomain> | null): BaseApplicationStrategy;
}

export type InterfaceApplicationFactory = IApplicationStrategyFactory;

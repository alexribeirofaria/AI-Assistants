import { DomainConstructor } from '../../application/strategies/abstracts/base-application-strategy';
import { BaseDomain } from '../../domain';
import { Registry } from './registry';
import { BaseRepositoryStrategy } from './strategies/abstracts/base-repository-strategy';

export class Repository {
  private readonly providers = new Map<string, BaseRepositoryStrategy>();

  constructor(public readonly registry: Registry = new Registry()) {}

  public buildDomain(domain: DomainConstructor): BaseDomain {
    return this.getProvider(domain).buildDomain();
  }

  private getProvider(domain: DomainConstructor): BaseRepositoryStrategy {
    const key = this.resolveProviderKey(domain);
    const cached = this.providers.get(key);
    if (cached) {
      return cached;
    }

    const provider = this.registry.create(key);
    this.providers.set(key, provider);
    return provider;
  }

  private resolveProviderKey(domain: DomainConstructor): string {
    const registryWithEntry = this.registry as Registry & {
      getEntry?: (domainName: string | DomainConstructor) => { domainClass: DomainConstructor };
    };

    if (typeof registryWithEntry.getEntry === 'function') {
      return registryWithEntry.getEntry(domain).domainClass.name;
    }

    return domain.name;
  }
}

import { ClaudeStrategy, GeminiStrategy, GroqStrategy, LangChainStrategy, OpenAIStrategy } from '../';
import { BaseDomain } from '../../../domain/abstracts/base-domain';
import { BaseApplicationStrategy, DomainConstructor } from '../abstracts/base-application-strategy';

export class StrategyApplicationFactory {
  private creators: Record<string, () => BaseApplicationStrategy> = {
    GroqDomain: () => new GroqStrategy(),
    GeminiDomain: () => new GeminiStrategy(),
    OpenAIDomain: () => new OpenAIStrategy(),
    ClaudeDomain: () => new ClaudeStrategy(),
    LangChainDomain: () => new LangChainStrategy(),
  };

constructor(
    creators: Record<string, () => BaseApplicationStrategy> | null = null,
    public readonly defaultDomain: string = 'GroqDomain'
  ) {
    if (creators) {
      Object.assign(this.creators, creators);
    }
    if (!this.creators[this.defaultDomain]) {
      throw new Error('Default strategy must exist in creators');
    }
  }

  private static _sanitize(value: string): string {
    return value.trim().toLowerCase().replace(/_/g, '').replace(/ /g, '');
  }

  parseDomain(value: string | DomainConstructor<BaseDomain> | null): DomainConstructor<BaseDomain> | null {
    if (!value) return null;

    if (typeof value === 'function' && 'prototype' in value) {
      return Object.keys(this.creators).includes(value.name)
        ? value as DomainConstructor<BaseDomain>
        : null;
    }

    const normalized = StrategyApplicationFactory._sanitize(value);
    for (const domainCtor of this.available()) {
      const aliases = [
        StrategyApplicationFactory._sanitize(domainCtor.name),
        StrategyApplicationFactory._sanitize(BaseDomain.getDomainName.call(domainCtor)),
      ];
      if (aliases.includes(normalized)) {
        return domainCtor;
      }
    }
    return null;
  }

  register(domain: DomainConstructor<BaseDomain>, creator: () => BaseApplicationStrategy): void {
    this.creators[domain.name] = creator;
  }

  create(domain: DomainConstructor<BaseDomain>): BaseApplicationStrategy {
    return this._resolveCreator(domain)();
  }

  private _resolveCreator(domain: DomainConstructor<BaseDomain>): () => BaseApplicationStrategy {
    return this.creators[domain.name] || this.creators[this.defaultDomain];
  }

  available(): DomainConstructor<BaseDomain>[] {
    return Object.values(this.creators).map((creator) => creator().domainClass);
  }

  getStrategy(value: string | DomainConstructor<BaseDomain> | null): BaseApplicationStrategy {
    return this.getCreator(value)();
  }

  getCreator(value: string | DomainConstructor<BaseDomain> | null): () => BaseApplicationStrategy {
    const domain = this.parseDomain(value) ?? this.available().find((candidate) => candidate.name === this.defaultDomain);
    if (!domain) {
      throw new Error('Default strategy must exist in creators');
    }
    return this._resolveCreator(domain);
  }
}

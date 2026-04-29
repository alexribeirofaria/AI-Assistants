import { ClaudeStrategy, GeminiStrategy, GroqStrategy, LangChainStrategy, OpenAIStrategy } from '..';
import { BaseDomain } from '../../../domain/abstracts/base-domain';
import { BaseApplicationStrategy, DomainConstructor } from '../abstracts/base-application-strategy';

export class StrategyApplicationFactory {
  private creators: Record<string, () => BaseApplicationStrategy> = {
    Groq: () => new GroqStrategy(),
    Gemini: () => new GeminiStrategy(),
    OpenAI: () => new OpenAIStrategy(),
    Claude: () => new ClaudeStrategy(),
    LangChain: () => new LangChainStrategy(),
  };

constructor(
    creators: Record<string, () => BaseApplicationStrategy> | null = null,
    public readonly defaultDomain: string = 'Groq'
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

  public availableDomainKeys(): string[] {
    return Object.keys(this.creators);
  }

  public getDomainKey(value: string | DomainConstructor<BaseDomain> | null): string | null {
    const parsed = this.parseDomain(value);
    if (!parsed) return null;

    for (const [key, creator] of Object.entries(this.creators)) {
      const domainCtor = creator().domainClass as DomainConstructor<BaseDomain>;
      if (domainCtor === parsed) {
        return key;
      }
    }

    return null;
  }

  parseDomain(value: string | DomainConstructor<BaseDomain> | null): DomainConstructor<BaseDomain> | null {
    if (!value) return null;

    if (typeof value === 'function' && 'prototype' in value) {
      for (const creator of Object.values(this.creators)) {
        const domainCtor = creator().domainClass as DomainConstructor<BaseDomain>;
        if (domainCtor === value) {
          return domainCtor;
        }
      }
      return null;
    }

    const normalized = StrategyApplicationFactory._sanitize(value);
    for (const creator of Object.values(this.creators)) {
      const domainCtor = creator().domainClass;
      const aliases = [
        StrategyApplicationFactory._sanitize(domainCtor.name),
        StrategyApplicationFactory._sanitize(domainCtor.getDomainName()),
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
    const domain = this.parseDomain(value);
    if (!domain) {
      throw new Error(`Provider não suportado: ${String(value)}`);
    }
    return this._resolveCreator(domain);
  }
}

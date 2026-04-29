import { DomainConstructor } from '../../application/strategies/abstracts/base-application-strategy';
import { Claude, Gemini, Groq, LangChain, OpenAI } from '../../domain';
import { ClaudeServer, GeminiServer, GroqServer, LangChainServer, OpenAIServer } from '../servers';
import { Builder } from './builder';
import { RepositoryStrategy } from './strategies/repository-strategy';

export interface RegistryEntry {
  domainClass: DomainConstructor;
  provider: () => RepositoryStrategy;
}

export class Registry {
  private readonly domains: Record<string, RegistryEntry> = {
    Claude: { domainClass: Claude, provider: () => new RepositoryStrategy(new Builder(Claude, () => new ClaudeServer())) },
    Gemini: { domainClass: Gemini, provider: () => new RepositoryStrategy(new Builder(Gemini, () => new GeminiServer())) },
    Groq: { domainClass: Groq, provider: () => new RepositoryStrategy(new Builder(Groq, () => new GroqServer())) },
    LangChain: { domainClass: LangChain, provider: () => new RepositoryStrategy(new Builder(LangChain, () => new LangChainServer())) },
    OpenAI: { domainClass: OpenAI, provider: () => new RepositoryStrategy(new Builder(OpenAI, () => new OpenAIServer())) },
  };

  availableDomains(): string[] {
    return Object.keys(this.domains);
  }

  create(domainName: string | DomainConstructor): RepositoryStrategy {
    return this.getEntry(domainName).provider();
  }

  getEntry(domainName: string | DomainConstructor): RegistryEntry {
    const key = this.resolveKey(domainName);
    const entry = this.domains[key];
    if (!entry) {
      throw new Error(`provider não encontrado: ${this.describeDomain(domainName)}`);
    }
    return entry;
  }

  private resolveKey(domain: string | DomainConstructor): string {
    if (typeof domain === 'function') {
      for (const [key, entry] of Object.entries(this.domains)) {
        if (entry.domainClass === domain) {
          return key;
        }
      }

      const byName = this.findKeyByAlias(domain.name);
      if (byName) {
        return byName;
      }

      const byDomainName = this.findKeyByAlias(domain.getDomainName());
      if (byDomainName) {
        return byDomainName;
      }

      return domain.name;
    }

    return this.findKeyByAlias(domain) ?? domain;
  }

  private findKeyByAlias(value: string): string | null {
    const normalizedValue = Registry.normalize(value);

    for (const [key, entry] of Object.entries(this.domains)) {
      const aliases = [
        key,
        key.toLowerCase(),
        entry.domainClass.name,
        entry.domainClass.getDomainName(),
      ].map((alias) => Registry.normalize(alias));

      if (aliases.includes(normalizedValue)) {
        return key;
      }
    }

    return null;
  }

  private describeDomain(domain: string | DomainConstructor): string {
    return typeof domain === 'string' ? domain : domain.name;
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase().replace(/_/g, '').replace(/ /g, '');
  }
}

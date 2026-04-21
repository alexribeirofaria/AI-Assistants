import { DomainConstructor } from '../../application/strategies/abstracts/base-application-strategy';
import { ClaudeDomain, GeminiDomain, GroqDomain, LangChainDomain, OpenAIDomain } from '../../domain';

export interface RegistryEntry {
  domainClass: DomainConstructor;
}

export class Registry {
  private readonly domains: Record<string, RegistryEntry> = {
    ClaudeDomain: { domainClass: ClaudeDomain },
    GeminiDomain: { domainClass: GeminiDomain },
    GroqDomain: { domainClass: GroqDomain },
    LangChainDomain: { domainClass: LangChainDomain },
    OpenAIDomain: { domainClass: OpenAIDomain },
  };

  availableDomains(): string[] {
    return Object.keys(this.domains);
  }

  create(domainName: string): RegistryEntry {
    const entry = this.domains[domainName];
    if (!entry) {
      throw new Error(`provider não encontrado: ${domainName}`);
    }
    return entry;
  }
}

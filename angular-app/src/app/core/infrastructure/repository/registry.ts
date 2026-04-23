import { DomainConstructor } from '../../application/strategies/abstracts/base-application-strategy';
import { ClaudeDomain, GeminiDomain, GroqDomain, LangChainDomain, OpenAIDomain } from '../../domain';
import { ClaudeServer, GeminiServer, GroqServer, LangChainServer, OpenAIServer } from '../servers';
import { Builder } from './builder';
import { RepositoryStrategy } from './strategies/repository-strategy';

export interface RegistryEntry {
  domainClass: DomainConstructor;
  provider: () => RepositoryStrategy;
}

export class Registry {
  private readonly domains: Record<string, RegistryEntry> = {
    ClaudeDomain: { domainClass: ClaudeDomain, provider: () => new RepositoryStrategy(new Builder(ClaudeDomain, () => new ClaudeServer())) },
    GeminiDomain: { domainClass: GeminiDomain, provider: () => new RepositoryStrategy(new Builder(GeminiDomain, () => new GeminiServer())) },
    GroqDomain: { domainClass: GroqDomain, provider: () => new RepositoryStrategy(new Builder(GroqDomain, () => new GroqServer())) },
    LangChainDomain: { domainClass: LangChainDomain, provider: () => new RepositoryStrategy(new Builder(LangChainDomain, () => new LangChainServer())) },
    OpenAIDomain: { domainClass: OpenAIDomain, provider: () => new RepositoryStrategy(new Builder(OpenAIDomain, () => new OpenAIServer())) },
  };

  availableDomains(): string[] {
    return Object.keys(this.domains);
  }

  create(domainName: string): RepositoryStrategy {
    return this.getEntry(domainName).provider();
  }

  getEntry(domainName: string): RegistryEntry {
    const entry = this.domains[domainName];
    if (!entry) {
      throw new Error(`provider não encontrado: ${domainName}`);
    }
    return entry;
  }
}

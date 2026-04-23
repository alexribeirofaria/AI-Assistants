import { IServer } from '../../../infrastructure/servers';
import { BaseDomain } from '../../../domain/abstracts/base-domain';
import { Repository } from '../../../infrastructure/repository';

export interface DomainConstructor<T extends BaseDomain = BaseDomain> {
  new (
    server: IServer,
    modelName: string
  ): T;
  name: string;
  getDomainName(): string;
}

export interface DomainListView {
  header: string;
  names: string[];
  prefix: string;
}

export abstract class BaseApplicationStrategy {
  private domainInstance: BaseDomain | null = null;

  protected constructor(
    public readonly domainClass: DomainConstructor,
    private readonly repository: Repository = new Repository()
  ) {}

  protected ensureDomain(): BaseDomain {
    if (!this.domainInstance) {
      this.domainInstance = this.repository.buildDomain(this.domainClass);
    }
    return this.domainInstance;
  }

  async execute(task: string): Promise<string> {
    return this.ensureDomain().sendMessage(task);
  }

  async listDomains(): Promise<DomainListView> {
    const names = await this.ensureDomain().listModels();
    return {
      header: `=== ${this.domainClass.getDomainName()} Models ===`,
      names,
      prefix: '',
    };
  }
}

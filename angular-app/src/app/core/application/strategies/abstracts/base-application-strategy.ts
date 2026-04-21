import { IServer } from '../../../infrastructure/servers';
import { BaseDomain } from '../../../domain/abstracts/base-domain';

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
  protected constructor(public readonly domainClass: DomainConstructor) {}

  async execute(task: string): Promise<string> {
    return Promise.resolve(task);
  }

  listDomains(): DomainListView {
    return {
      header: `${this.domainClass.getDomainName()} models`,
      names: [],
      prefix: '- ',
    };
  }
}

import { BaseDomain } from "../../../domain";
import { BaseRepositoryStrategy } from "../../repository";

class TestDomain extends BaseDomain {
  constructor() {
    super({
      chat: { completions: { create: jasmine.createSpy('create') } },
      models: { list: jasmine.createSpy('list').and.returnValue({ data: [] }) },
    } as never, 'test');
  }

  static override getDomainName(): string {
    return 'Test';
  }

  protected _fetchDomainNames(): string[] {
    return [];
  }

  buildResponseMessages(): string {
    return '';
  }

  sendMessage(): Promise<string> {
    return Promise.resolve('');
  }

  async listModels(): Promise<string[]> {
    return [];
  }
}

class ConcreteRepositoryStrategy extends BaseRepositoryStrategy {
  buildDomain(): BaseDomain {
    return new TestDomain();
  }
}

describe('BaseRepositoryStrategy', () => {
  it('builds a domain', () => {
    expect(new ConcreteRepositoryStrategy().buildDomain()).toBeTruthy();
  });
});

import type { InterfaceApplicationFactory } from '../../strategies/factories/abstracts/interface-application-factory';
import { BaseApplicationStrategy } from '../../strategies/abstracts/base-application-strategy';
import { BaseDomain } from '../../../domain/abstracts/base-domain';

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

  listModels(): string[] {
    return [];
  }
}

class TestStrategy extends BaseApplicationStrategy {
  constructor() {
    super(TestDomain);
  }
}

describe('InterfaceApplicationFactory', () => {
  it('describes the strategy contract', () => {
    const instance: InterfaceApplicationFactory = {
      getStrategy: () => new TestStrategy(),
    };
    expect(instance.getStrategy('test')).toBeTruthy();
  });
});

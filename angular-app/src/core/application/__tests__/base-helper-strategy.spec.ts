import { UserAction } from '../enums/user-action';
import { BaseHelperStrategy } from '../decorator/helpers/strategies/abstracts/base-helper-strategy';
import { BaseDomain } from '../../domain/abstracts/base-domain';

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

class ConcreteStrategy extends BaseHelperStrategy {
  canHandle(normalized: string): boolean {
    return normalized === 'test';
  }

  handle(normalized: string, tokens: string[]): [UserAction, string | import('../strategies/abstracts/base-application-strategy').DomainConstructor | null] {
    void normalized;
    void tokens;
    return [UserAction.MESSAGE, TestDomain];
  }
}

describe('BaseHelperStrategy', () => {
  it('supports concrete strategies', () => {
    const strategy = new ConcreteStrategy();
    expect(strategy.canHandle('test')).toBeTrue();
    expect(strategy.handle('test', [])[1]).toBe(TestDomain);
  });
});

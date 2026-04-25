import { BaseDomain } from '../../domain/abstracts/base-domain';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';
import { Repository } from '../../infrastructure/repository/repository';

class FakeDomain extends BaseDomain {
  constructor() {
    super({ models: { list: async () => ({ data: [] }) } } as never, 'fake-model');
  }

  override buildResponseMessages(response: unknown): string {
    return String(response ?? '');
  }

  override async sendMessage(prompt: string): Promise<string> {
    return `sent:${prompt}`;
  }

  override async listModels(): Promise<string[]> {
    return ['m1', 'm2'];
  }

  protected async _fetchDomainNames(): Promise<string[]> {
    return ['m1', 'm2'];
  }
}

class FakeStrategy extends BaseApplicationStrategy {
  constructor(repository: Repository) {
    super(FakeDomain, repository);
  }
}

describe('BaseApplicationStrategy Unit Tests', () => {
  it('builds the domain lazily and caches it for subsequent calls', () => {
    const domain = new FakeDomain();
    const repository = {
      buildDomain: jasmine.createSpy('buildDomain').and.returnValue(domain),
    } as unknown as Repository;
    const strategy = new FakeStrategy(repository);

    strategy.useModel('m2');
    strategy.useModel('m1');

    expect(repository.buildDomain).toHaveBeenCalledTimes(1);
    expect(strategy.getCurrentModel()).toBe('m1');
  });

  it('executes messages through the ensured domain instance', async () => {
    const strategy = new FakeStrategy({
      buildDomain: jasmine.createSpy('buildDomain').and.returnValue(new FakeDomain()),
    } as unknown as Repository);

    await expectAsync(strategy.execute('hello')).toBeResolvedTo('sent:hello');
  });

  it('lists domains with default view metadata', async () => {
    const strategy = new FakeStrategy({
      buildDomain: jasmine.createSpy('buildDomain').and.returnValue(new FakeDomain()),
    } as unknown as Repository);

    await expectAsync(strategy.listDomains()).toBeResolvedTo({
      header: '=== FakeDomain Models ===',
      names: ['m1', 'm2'],
      prefix: '',
    });
  });
});

import { StrategyApplicationFactory } from '../strategies/factories/strategy-application-factory';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';
import { OpenAIDomain } from '../../domain/openai-domain';

const mockServer = {
  chat: { completions: { create: jasmine.createSpy('create') } },
  models: { list: jasmine.createSpy('list').and.returnValue({ data: [] }) },
} as never;

class TestDomain extends OpenAIDomain {
  constructor() {
    super(mockServer, 'test');
  }

  static override getDomainName(): string {
    return 'Test Domain';
  }
}

class TestStrategy extends BaseApplicationStrategy {
  constructor() {
    super(TestDomain);
  }
}

describe('StrategyApplicationFactory', () => {
  it('creates the default set and resolves domains', () => {
    const factory = new StrategyApplicationFactory();
    expect(factory.available().map((domain) => domain.name)).toContain('OpenAIDomain');
    expect(factory.parseDomain('openai')?.name).toBe('OpenAIDomain');
  });

  it('resolves aliases, functions and registered creators', () => {
    const factory = new StrategyApplicationFactory({ TestDomain: () => new TestStrategy() } as never, 'TestDomain');

    expect(factory.parseDomain('test domain')?.name).toBe('TestDomain');
    expect(factory.parseDomain(TestDomain)?.name).toBe('TestDomain');

    factory.register(TestDomain, () => new TestStrategy());
    expect(factory.getCreator('missing')().domainClass.name).toBe('TestDomain');
    expect(factory.create(TestDomain).domainClass.name).toBe('TestDomain');
  });

  it('rejects invalid defaults', () => {
    expect(() => new StrategyApplicationFactory(null, 'InvalidDomain')).toThrowError('Default strategy must exist in creators');
  });
});

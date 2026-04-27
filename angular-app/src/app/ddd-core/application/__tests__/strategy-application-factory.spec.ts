import { OpenAI } from '../../domain/openai-domain';
import { BaseApplicationStrategy } from '../strategies/abstracts/base-application-strategy';
import { StrategyApplicationFactory } from '../strategies/factories/strategy-application-factory';

const mockServer = {
  chat: { completions: { create: jasmine.createSpy('create') } },
  models: { list: jasmine.createSpy('list').and.returnValue({ data: [] }) },
} as never;

class TestDomain extends OpenAI {
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
    expect(factory.available().map((domain) => domain.name)).toContain('OpenAI');
    expect(factory.parseDomain('openai')?.name).toBe('OpenAI');
  });

  it('resolves aliases, functions and registered creators', () => {
    const factory = new StrategyApplicationFactory({ TestDomain: () => new TestStrategy() } as never, 'TestDomain');

    expect(factory.parseDomain('test domain')?.name).toBe('TestDomain');
    expect(factory.parseDomain(TestDomain)?.name).toBe('TestDomain');
    expect(factory.getDomainKey('test domain')).toBe('TestDomain');
    expect(factory.getDomainKey(TestDomain)).toBe('TestDomain');

    factory.register(TestDomain, () => new TestStrategy());
    expect(factory.create(TestDomain).domainClass.name).toBe('TestDomain');
  });

  it('throws when provider is invalid', () => {
    const factory = new StrategyApplicationFactory({ TestDomain: () => new TestStrategy() } as never, 'TestDomain');

    expect(() => factory.getCreator('missing')).toThrowError('Provider não suportado: missing');
  });

  it('rejects invalid defaults', () => {
    expect(() => new StrategyApplicationFactory(null, 'InvalidDomain')).toThrowError('Default strategy must exist in creators');
  });
});

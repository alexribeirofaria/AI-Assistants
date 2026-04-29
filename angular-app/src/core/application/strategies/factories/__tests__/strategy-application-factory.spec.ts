import { BaseApplicationStrategy } from '../../abstracts/base-application-strategy';
import { StrategyApplicationFactory } from '../strategy-application-factory';

describe('StrategyApplicationFactory', () => {
  class AliasDomain {
    constructor(_server?: unknown, _provider?: string) {}

    static getDomainName(): string {
      return 'Test Provider';
    }
  }

  class AliasStrategy extends BaseApplicationStrategy {
    constructor() {
      super(AliasDomain as never);
    }

    override useModel(): void {}

    override getCurrentModel(): string {
      return 'model-a';
    }

    override async execute(task: string): Promise<string> {
      return task;
    }

    override async listDomains() {
      return { header: 'header', names: ['model-a'], prefix: '' };
    }
  }

  const createFactory = () =>
    new StrategyApplicationFactory({ AliasDomain: () => new AliasStrategy() } as never, 'AliasDomain');

  it('parses a domain by its class name alias', () => {
    const factory = createFactory();

    expect(factory.parseDomain('aliasdomain')).toBe(AliasDomain as never);
  });

  it('parses a domain by its display name alias', () => {
    const factory = createFactory();

    expect(factory.parseDomain('test provider')).toBe(AliasDomain as never);
    expect(factory.parseDomain('TestProvider')).toBe(AliasDomain as never);
  });

  it('returns the registered domain key for aliases', () => {
    const factory = createFactory();

    expect(factory.getDomainKey('test provider')).toBe('AliasDomain');
  });

  it('throws for unsupported providers when resolving creators', () => {
    const factory = createFactory();

    expect(() => factory.getCreator('unknown')).toThrowError('Provider não suportado: unknown');
  });
});

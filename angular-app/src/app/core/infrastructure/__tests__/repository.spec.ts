import { Repository } from '../repository/repository';

describe('Repository Unit Tests', () => {
  it('uses a registry by default', () => {
    expect(new Repository().registry).toBeTruthy();
  });

  it('should build a domain through the registry provider', () => {
    const builtDomain = { kind: 'domain' };
    const createSpy = jasmine.createSpy('create').and.returnValue({
      buildDomain: jasmine.createSpy('buildDomain').and.returnValue(builtDomain),
    });
    const repository = new Repository({ create: createSpy } as never);

    const result = repository.buildDomain({ name: 'DemoDomain' } as never);

    expect(result).toBe(builtDomain as never);
    expect(createSpy).toHaveBeenCalledOnceWith('DemoDomain');
  });

  it('should cache providers by domain name', () => {
    const strategy = {
      buildDomain: jasmine.createSpy('buildDomain').and.returnValues({ id: 1 }, { id: 2 }),
    };
    const createSpy = jasmine.createSpy('create').and.returnValue(strategy);
    const repository = new Repository({ create: createSpy } as never);
    const domain = { name: 'CachedDomain' } as never;

    repository.buildDomain(domain);
    repository.buildDomain(domain);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(strategy.buildDomain).toHaveBeenCalledTimes(2);
  });
});

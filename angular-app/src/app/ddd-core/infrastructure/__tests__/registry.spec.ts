import { Registry } from '../repository/registry';

describe('Registry Unit Tests', () => {
  it('lists available domains and creates known ones', () => {
    const registry = new Registry();
    expect(registry.availableDomains()).toContain('OpenAI');
    expect(registry.getEntry('OpenAI').domainClass.name).toBe('OpenAI');
    expect(registry.create('OpenAI')).toBeTruthy();
  });

  it('creates providers for all registered domains', () => {
    const registry = new Registry();

    for (const domainName of registry.availableDomains()) {
      expect(registry.getEntry(domainName).domainClass).toBeTruthy();
      expect(registry.create(domainName)).toBeTruthy();
    }
  });

  it('should throw when requesting an unknown provider', () => {
    const registry = new Registry();
    expect(() => registry.getEntry('UnknownDomain')).toThrowError(
      'provider não encontrado: UnknownDomain'
    );
  });
});

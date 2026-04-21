import { Registry } from '../repository/registry';

describe('Registry', () => {
  it('lists available domains and creates known ones', () => {
    const registry = new Registry();
    expect(registry.availableDomains()).toContain('OpenAIDomain');
    expect(registry.create('OpenAIDomain').domainClass.name).toBe('OpenAIDomain');
  });
});

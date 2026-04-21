import { CachedDomainListMixin } from '../cache/domain-list-cache';

class ConcreteMixin extends CachedDomainListMixin {
  _fetchDomainNames(): string[] {
    return ['model1', 'model2 / sub', '  model3'];
  }

  fetchCachedNames(): string[] {
    return this.getDomainNamesCached();
  }

  overrideFetchDomainNames(fetcher: () => string[]): void {
    this._fetchDomainNames = fetcher;
  }

  readCacheValue(): readonly string[] | null {
    return (this as unknown as { _domainCache: { value: readonly string[] | null } })._domainCache.value;
  }
}

describe('CachedDomainListMixin', () => {
  let mixin: ConcreteMixin;

  beforeEach(() => {
    mixin = new ConcreteMixin();
  });

  it('should be created', () => {
    expect(mixin).toBeTruthy();
  });

  it('should fetch and cache domain names', () => {
    const names = mixin.fetchCachedNames();
    expect(names).toContain('model1');
    expect(names).toContain('sub');
    expect(names).toContain('model3');
    expect(names.length).toBe(3);
  });

  it('should clean names correctly', () => {
    expect(mixin['_cleanName']('model/path')).toBe('path');
    expect(mixin['_cleanName']('model')).toBe('model');
  });

  it('should get domain view with prefix', () => {
    const view = mixin.getDomainView('> ');
    expect(view).toEqual(['> model1', '> model3', '> sub']);
  });

  it('should clear cache', () => {
    mixin.fetchCachedNames();
    mixin.clearDomainCache();
    expect(mixin.readCacheValue()).toBeNull();
  });

  it('should limit cache items', () => {
    const manyNames = Array(60).fill(0).map((_, i) => `model${i}`);
    mixin.overrideFetchDomainNames(() => manyNames);
    const cached = mixin.fetchCachedNames();
    expect(cached.length).toBe(50);
  });
});

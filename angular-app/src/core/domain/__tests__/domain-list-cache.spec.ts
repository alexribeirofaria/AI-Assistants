import { CachedDomainListMixin } from '../cache/domain-list-cache';

class ConcreteMixin extends CachedDomainListMixin {
  _fetchDomainNames(): string[] {
    return ['model1', 'model2 / sub', '  model3'];
  }

  async fetchCachedNames(): Promise<string[]> {
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

  it('should fetch and cache domain names', async () => {
    const names = await mixin.fetchCachedNames();
    expect(names).toContain('model1');
    expect(names).toContain('sub');
    expect(names).toContain('model3');
    expect(names.length).toBe(3);
  });

  it('should clean names correctly', () => {
    expect(mixin['_cleanName']('model/path')).toBe('path');
    expect(mixin['_cleanName']('model')).toBe('model');
  });

  it('should get domain view with prefix', async () => {
    const view = await mixin.getDomainView('> ');
    expect(view).toEqual(['> model1', '> model3', '> sub']);
  });

  it('should clear cache', async () => {
    await mixin.fetchCachedNames();
    mixin.clearDomainCache();
    expect(mixin.readCacheValue()).toBeNull();
  });

  it('should limit cache items', async () => {
    const manyNames = Array(60).fill(0).map((_, i) => `model${i}`);
    mixin.overrideFetchDomainNames(() => manyNames);
    const cached = await mixin.fetchCachedNames();
    expect(cached.length).toBe(50);
  });

  it('should reuse a pending request and sanitize duplicated names', async () => {
    let resolveFetch: ((value: string[]) => void) | null = null;
    const fetchPromise = new Promise<string[]>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchSpy = jasmine.createSpy('fetchSpy').and.returnValue(fetchPromise);
    mixin.overrideFetchDomainNames(fetchSpy as unknown as () => string[]);

    const first = mixin.fetchCachedNames();
    const second = mixin.fetchCachedNames();

    resolveFetch!([' models/a ', 'a', 'b', 'b']);
    await expectAsync(first).toBeResolvedTo(['a', 'b']);
    await expectAsync(second).toBeResolvedTo(['a', 'b']);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should expose cache stats after hits and misses', async () => {
    expect(mixin.getDomainCacheStats().misses).toBe(0);
    await mixin.fetchCachedNames();
    await mixin.fetchCachedNames();

    const stats = mixin.getDomainCacheStats();
    expect(stats.hits).toBeGreaterThan(0);
    expect(stats.hasValue).toBeTrue();
  });
});

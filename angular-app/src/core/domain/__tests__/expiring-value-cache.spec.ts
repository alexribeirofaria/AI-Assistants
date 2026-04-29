import { ExpiringValueCache } from '../cache/expiring-value-cache';

describe('ExpiringValueCache', () => {
  let cache: ExpiringValueCache<string>;
  const ttl = 0.1; // short TTL for testing
  let now = 0;

  beforeEach(() => {
    cache = new ExpiringValueCache<string>(ttl);
    now = 0;
    spyOn(performance, 'now').and.callFake(() => now);
  });

  it('should be created', () => {
    expect(cache).toBeTruthy();
  });

  it('should set and get value', () => {
    cache.set('test');
    expect(cache.get()).toBe('test');
    expect(cache.getStats().hits).toBe(1);
  });

  it('should expire value after TTL', () => {
    cache.set('test');
    expect(cache.get()).toBe('test');

    now = (ttl * 1000) + 10;

    expect(cache.hasValue()).toBe(false);
    expect(cache.get()).toBeNull();
    expect(cache.getStats().evictions).toBe(1);
  });

  it('should getOrSet fetch new value when expired', () => {
    const fetchFn = jasmine.createSpy('fetchFn').and.returnValue('new');
    cache.set('old');
    now = (ttl * 1000) + 10;

    expect(cache.getOrSet(fetchFn)).toBe('new');
    expect(fetchFn.calls.count()).toBe(1);
  });

  it('should clear cache', () => {
    cache.set('test');
    cache.clear();
    expect(cache.get()).toBeNull();
  });

  it('should return cached value in getOrSet without invoking fetch function', () => {
    cache.set('cached');
    const fetchFn = jasmine.createSpy('fetchFn').and.returnValue('new');

    expect(cache.getOrSet(fetchFn)).toBe('cached');
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it('should report hasValue false after expiration via stats', () => {
    cache.set('value');
    now = (ttl * 1000) + 10;

    const stats = cache.getStats();
    expect(stats.hasValue).toBeFalse();
  });

  it('should track stats correctly', () => {
    cache.getOrSet(() => 'value1');
    cache.get(); // hit
    cache.clear();
    expect(cache.getStats()).toEqual({
      hits: 1,
      misses: 1,
      evictions: 0,
      hasValue: false,
    });
  });
});

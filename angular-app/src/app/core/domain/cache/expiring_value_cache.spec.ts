import { ExpiringValueCache } from './expiring_value_cache';

describe('ExpiringValueCache', () => {
  it('should be instantiated', () => {
    const instance = new ExpiringValueCache();
    expect(instance).toBeTruthy();
  });
});

import { BaseDomain } from './base_domain';

describe('BaseDomain', () => {
  it('should be instantiated', () => {
    const instance = new BaseDomain();
    expect(instance).toBeTruthy();
  });
});

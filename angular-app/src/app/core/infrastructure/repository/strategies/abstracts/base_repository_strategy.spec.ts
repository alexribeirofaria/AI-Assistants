import { BaseRepositoryStrategy } from './base_repository_strategy';

describe('BaseRepositoryStrategy', () => {
  it('should be instantiated', () => {
    const instance = new BaseRepositoryStrategy();
    expect(instance).toBeTruthy();
  });
});

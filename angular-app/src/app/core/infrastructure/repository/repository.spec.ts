import { Repository } from './repository';

describe('Repository', () => {
  it('should be instantiated', () => {
    const instance = new Repository();
    expect(instance).toBeTruthy();
  });
});

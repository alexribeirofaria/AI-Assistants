import { Registry } from './registry';

describe('Registry', () => {
  it('should be instantiated', () => {
    const instance = new Registry();
    expect(instance).toBeTruthy();
  });
});

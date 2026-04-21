import { ClearStrategy } from '../decorator/helpers/strategies/clear-strategy';

describe('ClearStrategy', () => {
  it('should be instantiated', () => {
    const instance = new ClearStrategy();
    expect(instance).toBeTruthy();
  });
});

import { ExitStrategy } from '../decorator/helpers/strategies/exit-strategy';

describe('ExitStrategy', () => {
  it('should be instantiated', () => {
    const instance = new ExitStrategy();
    expect(instance).toBeTruthy();
  });
});

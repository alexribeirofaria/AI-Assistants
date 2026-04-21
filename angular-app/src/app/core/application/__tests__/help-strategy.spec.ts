import { HelpStrategy } from '../decorator/helpers/strategies/help-strategy';

describe('HelpStrategy', () => {
  it('should be instantiated', () => {
    const instance = new HelpStrategy();
    expect(instance).toBeTruthy();
  });
});

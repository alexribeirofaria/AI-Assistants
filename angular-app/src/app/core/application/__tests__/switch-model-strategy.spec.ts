import { SwitchModelStrategy } from '../decorator/helpers/strategies/switch-model-strategy';

describe('SwitchModelStrategy', () => {
  it('should be instantiated', () => {
    const instance = new SwitchModelStrategy();
    expect(instance).toBeTruthy();
  });
});

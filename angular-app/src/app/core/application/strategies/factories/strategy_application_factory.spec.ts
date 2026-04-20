import { StrategyApplicationFactory } from './strategy_application_factory';

describe('StrategyApplicationFactory', () => {
  it('should be instantiated', () => {
    const instance = new StrategyApplicationFactory();
    expect(instance).toBeTruthy();
  });
});

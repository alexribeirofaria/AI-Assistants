import { UserAction } from '../enums/user-action';
import { ClearStrategy } from '../decorator/helpers/strategies/clear-strategy';

describe('ClearStrategy Unit Tests', () => {
  let instance: ClearStrategy;

  beforeEach(() => {
    instance = new ClearStrategy();
  });

  it('matches clear aliases', () => {
    expect(instance.canHandle('cls', ['cls'])).toBeTrue();
    expect(instance.canHandle('clear', ['clear'])).toBeTrue();
  });

  it('does not match unrelated commands', () => {
    expect(instance.canHandle('help', ['help'])).toBeFalse();
  });

  it('returns clear action', () => {
    expect(instance.handle('clear', ['clear'])).toEqual([UserAction.CLEAR, null]);
  });
});

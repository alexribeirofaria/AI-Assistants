import { UserAction } from '../enums/user-action';
import { ExitStrategy } from '../decorator/helpers/strategies/exit-strategy';

describe('ExitStrategy Unit Tests', () => {
  let instance: ExitStrategy;

  beforeEach(() => {
    instance = new ExitStrategy();
  });

  it('matches exit aliases', () => {
    expect(instance.canHandle('exit', ['exit'])).toBeTrue();
    expect(instance.canHandle('quit', ['quit'])).toBeTrue();
    expect(instance.canHandle('sair', ['sair'])).toBeTrue();
  });

  it('does not match unrelated commands', () => {
    expect(instance.canHandle('models', ['models'])).toBeFalse();
  });

  it('returns exit action', () => {
    expect(instance.handle('exit', ['exit'])).toEqual([UserAction.EXIT, null]);
  });
});

import { UserAction } from '../enums/user-action';
import { HelpStrategy } from '../decorator/helpers/strategies/help-strategy';

describe('HelpStrategy Unit Tests', () => {
  let instance: HelpStrategy;

  beforeEach(() => {
    instance = new HelpStrategy();
  });

  it('matches help aliases', () => {
    expect(instance.canHandle('help', ['help'])).toBeTrue();
    expect(instance.canHandle('ajuda', ['ajuda'])).toBeTrue();
    expect(instance.canHandle('comandos', ['comandos'])).toBeTrue();
  });

  it('does not match unrelated commands', () => {
    expect(instance.canHandle('exit', ['exit'])).toBeFalse();
  });

  it('returns message action to trigger help view', () => {
    expect(instance.handle('help', ['help'])).toEqual([UserAction.MESSAGE, 'help']);
  });
});

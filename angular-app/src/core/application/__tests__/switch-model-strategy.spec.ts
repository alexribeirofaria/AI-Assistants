import { UserAction } from '../enums/user-action';
import { SwitchModelStrategy } from '../decorator/helpers/strategies/switch-model-strategy';

describe('SwitchModelStrategy Unit Tests', () => {
  let instance: SwitchModelStrategy;

  beforeEach(() => {
    instance = new SwitchModelStrategy();
  });

  it('matches known model/provider aliases', () => {
    expect(instance.canHandle('openai', ['openai'])).toBeTrue();
    expect(instance.canHandle('gemini', ['gemini'])).toBeTrue();
  });

  it('does not match unknown aliases', () => {
    expect(instance.canHandle('provider-inexistente', ['provider-inexistente'])).toBeFalse();
  });

  it('returns switch action with resolved domain when known', () => {
    const [action, value] = instance.handle('openai', ['openai']);

    expect(action).toBe(UserAction.SWITCH_MODEL);
    expect(typeof value).toBe('function');
  });

  it('returns switch action with null when alias is unknown', () => {
    expect(instance.handle('xpto', ['xpto'])).toEqual([UserAction.SWITCH_MODEL, null]);
  });

  it('resolves using token-level matches inside longer input', () => {
    const [action, value] = instance.handle('mudar para open ai', ['mudar', 'open', 'ai']);

    expect(action).toBe(UserAction.SWITCH_MODEL);
    expect(typeof value).toBe('function');
  });
});

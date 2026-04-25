import { UserAction } from '../enums/user-action';
import { ListModelsStrategy } from '../decorator/helpers/strategies/list-models-strategy';

describe('ListModelsStrategy Unit Tests', () => {
  let instance: ListModelsStrategy;

  beforeEach(() => {
    instance = new ListModelsStrategy();
  });

  it('matches list-model commands', () => {
    expect(instance.canHandle('list models', ['list', 'models'])).toBeTrue();
    expect(instance.canHandle('models', ['models'])).toBeTrue();
  });

  it('does not match unrelated commands', () => {
    expect(instance.canHandle('help', ['help'])).toBeFalse();
  });

  it('returns the list-models action', () => {
    expect(instance.handle('models', ['models'])).toEqual([UserAction.LIST_MODELS, null]);
  });
});

import { ListModelsStrategy } from '../decorator/helpers/strategies/list-models-strategy';

describe('ListModelsStrategy', () => {
  it('should be instantiated', () => {
    const instance = new ListModelsStrategy();
    expect(instance).toBeTruthy();
  });
});

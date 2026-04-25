import { DecoratorHelperStrategy } from '../decorator/helpers/decorator-helper-strategy';

describe('DecoratorHelperStrategy', () => {
  it('creates the default strategy chain', () => {
    const instances = DecoratorHelperStrategy.createInstances();
    expect(instances.length).toBeGreaterThan(0);
    expect(instances.some((instance) => instance.constructor.name === 'HelpStrategy')).toBeTrue();
  });
});

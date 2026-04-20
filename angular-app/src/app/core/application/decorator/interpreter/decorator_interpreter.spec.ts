import { DecoratorInterpreter } from './decorator_interpreter';

describe('DecoratorInterpreter', () => {
  it('should be instantiated', () => {
    const instance = new DecoratorInterpreter();
    expect(instance).toBeTruthy();
  });
});

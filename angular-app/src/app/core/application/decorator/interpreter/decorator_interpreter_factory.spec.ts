import { DecoratorInterpreterFactory } from './decorator_interpreter_factory';

describe('DecoratorInterpreterFactory', () => {
  it('should be instantiated', () => {
    const instance = new DecoratorInterpreterFactory();
    expect(instance).toBeTruthy();
  });
});

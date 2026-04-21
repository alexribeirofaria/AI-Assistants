import { DecoratorInterpreterFactory } from '../decorator/helpers/interpreter/decorator-interpreter-factory';

describe('DecoratorInterpreterFactory', () => {
  it('should be instantiated', () => {
    const instance = new DecoratorInterpreterFactory();
    expect(instance).toBeTruthy();
  });
});

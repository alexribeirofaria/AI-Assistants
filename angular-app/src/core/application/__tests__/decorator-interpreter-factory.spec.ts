import { DecoratorInterpreterFactory } from '../decorator/interpreter/decorator-interpreter-factory';

describe('DecoratorInterpreterFactory', () => {
  it('should be instantiated', () => {
    const instance = new DecoratorInterpreterFactory();
    expect(instance).toBeTruthy();
  });
});

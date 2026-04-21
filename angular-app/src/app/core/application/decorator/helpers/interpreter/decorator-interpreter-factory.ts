import { DecoratorInterpreter } from './decorator-interpreter';
import { DecoratorHelperStrategy } from '../decorator/decorator-helper-strategy';

export class DecoratorInterpreterFactory {
  static create(): DecoratorInterpreter {
    const strategies = DecoratorHelperStrategy.createInstances();
    return new DecoratorInterpreter(strategies);
  }
}

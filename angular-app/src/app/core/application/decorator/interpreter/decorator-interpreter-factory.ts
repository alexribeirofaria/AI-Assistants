import { DecoratorHelperStrategy } from '../helpers';
import { DecoratorInterpreter } from './decorator-interpreter';

export class DecoratorInterpreterFactory {
  static create(): DecoratorInterpreter {
    const strategies = DecoratorHelperStrategy.createInstances();
    return new DecoratorInterpreter(strategies);
  }
}

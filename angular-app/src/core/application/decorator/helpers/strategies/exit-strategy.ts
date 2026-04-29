import { UserAction } from '../../../enums/user-action';
import { DecoratorTextHelper } from '../decorator-text-helper';
import { BaseHelperStrategy } from './abstracts/base-helper-strategy';

const phrases = ['exit', 'quit', 'sair'];

export class ExitStrategy extends BaseHelperStrategy {

  override priority = 10;

  override canHandle(normalized: string, tokens: string[]): boolean {
    return DecoratorTextHelper.bestMatch(normalized, phrases, 0.75) !== null;
  }

  override handle(normalized: string, tokens: string[]): [UserAction, null] {
    return [UserAction.EXIT, null];
  }
}

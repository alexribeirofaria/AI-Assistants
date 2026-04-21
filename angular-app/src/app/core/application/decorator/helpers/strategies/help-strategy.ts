import { UserAction } from '../../../enums/user-action';
import { DecoratorTextHelper } from '../decorator-text-helper';
import { BaseHelperStrategy } from './abstracts/base-helper-strategy';

const phrases = ['help', 'ajuda', 'comandos'];

export class HelpStrategy extends BaseHelperStrategy {
  override priority = 5;

  override canHandle(normalized: string, tokens: string[]): boolean {
    return DecoratorTextHelper.bestMatch(normalized, phrases, 0.75) !== null;
  }

  override handle(normalized: string, tokens: string[]): [UserAction, string] {
    return [UserAction.MESSAGE, 'help'];
  }
}

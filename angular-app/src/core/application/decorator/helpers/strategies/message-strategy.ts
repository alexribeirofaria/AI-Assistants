import { UserAction } from '../../../enums/user-action';
import { BaseHelperStrategy } from './abstracts/base-helper-strategy';

export class MessageStrategy extends BaseHelperStrategy {
  override priority = 999;

  override canHandle(normalized: string, tokens: string[]): boolean {
    return true;
  }

  override handle(normalized: string, tokens: string[]): [UserAction, string] {
    return [UserAction.MESSAGE, tokens.join(' ')];
  }
}

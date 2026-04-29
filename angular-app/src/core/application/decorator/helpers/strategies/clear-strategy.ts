import { UserAction } from '../../../enums/user-action';
import { BaseHelperStrategy } from './abstracts/base-helper-strategy';

const phrases = ['cls', 'clear'];

export class ClearStrategy extends BaseHelperStrategy {

  override priority = 10;

  override canHandle(normalized: string, tokens: string[]): boolean {
    return phrases.some(p => normalized.replace(/ /g, '') === p.replace(/ /g, ''));
  }

  override handle(normalized: string, tokens: string[]): [UserAction, null] {
    return [UserAction.CLEAR, null];
  }
}

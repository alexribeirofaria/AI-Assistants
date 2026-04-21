import { UserAction } from '../../../enums/user-action';
import { DecoratorTextHelper } from '../decorator-text-helper';
import { BaseHelperStrategy } from './abstracts/base-helper-strategy';

const phrases = [
  'listmodels',
  'listmodel',
  'models',
  'modelos',
  'listar modelos',
];

export class ListModelsStrategy extends BaseHelperStrategy {
  override priority = 10;

  override canHandle(normalized: string, tokens: string[]): boolean {
    const candidate = normalized.replace(/ /g, '');
    const phraseCompacts = phrases.map(p => DecoratorTextHelper.normalizeText(p).replace(/ /g, ''));
    return DecoratorTextHelper.bestMatch(candidate, phraseCompacts, 0.70) !== null;
  }

  override handle(normalized: string, tokens: string[]): [UserAction, null] {
    return [UserAction.LIST_MODELS, null];
  }
}

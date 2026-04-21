import { IOutputPresenter } from '../../../../presentation/interfaces/i-output-presenter';
import { UserAction } from '../../../enums/user-action';
import { DomainConstructor } from '../../../strategies/abstracts/base-application-strategy';
import { DecoratorTextHelper } from '../decorator-text-helper';
import { BaseHelperStrategy } from '../strategies/abstracts/base-helper-strategy';

export class DecoratorInterpreter {
  private readonly strategies: BaseHelperStrategy[];
  private readonly expectedMap: Partial<Record<UserAction, string>> = {
    [UserAction.LIST_MODELS]: 'listmodels',
    [UserAction.EXIT]: 'exit',
    [UserAction.CLEAR]: 'cls',
  };

  constructor(strategies: Iterable<BaseHelperStrategy>) {
    this.strategies = Array.from(strategies).sort((a, b) => a['priority'] - b['priority']);
  }

  interpretUserInputWithFeedback(
    userInput: string,
    presenter: IOutputPresenter
  ): [UserAction, string | DomainConstructor | null] {
    const normalized = DecoratorTextHelper.normalizeText(userInput);
    const tokens = normalized.split(' ');

    const [action, value] = this._interpret(normalized, tokens);

    const expected = this.expectedMap[action as UserAction];
    const compactInput = normalized.replace(/ /g, '');

    if (expected && compactInput !== expected.replace(/ /g, '')) {
      presenter.showInterpretedInput(userInput, expected);
    }

    return [action, value];
  }

  private _interpret(normalized: string, tokens: string[]): [UserAction, string | DomainConstructor | null] {
    const candidate = normalized.replace(/ /g, '');

    for (const strategy of this.strategies) {
      if (strategy.canHandle(candidate, tokens)) {
        return strategy.handle(candidate, tokens);
      }
    }

    return [UserAction.MESSAGE, normalized];
  }
}

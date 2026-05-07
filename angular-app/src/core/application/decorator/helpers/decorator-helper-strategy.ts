import { BaseHelperStrategy } from './strategies/abstracts/base-helper-strategy';
import { ClearStrategy } from './strategies/clear-strategy';
import { ExitStrategy } from './strategies/exit-strategy';
import { HelpStrategy } from './strategies/help-strategy';
import { ListModelsStrategy } from './strategies/list-models-strategy';
import { MessageStrategy } from './strategies/message-strategy';
import { SwitchModelStrategy } from './strategies/switch-model-strategy';

export class DecoratorHelperStrategy {
  static createInstances(): BaseHelperStrategy[] {
    return [
      new HelpStrategy(),
      new ListModelsStrategy(),
      new ClearStrategy(),
      new ExitStrategy(),
      new SwitchModelStrategy(),
      new MessageStrategy(),
    ];
  }
}

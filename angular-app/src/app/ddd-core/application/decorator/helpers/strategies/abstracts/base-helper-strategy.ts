import { UserAction } from '../../../../enums/user-action';
import { DomainConstructor } from '../../../../strategies/abstracts/base-application-strategy';

export abstract class BaseHelperStrategy {
  protected priority = 0;

  abstract canHandle(normalized: string, tokens: string[]): boolean;

  abstract handle(normalized: string, tokens: string[]): [UserAction, string | DomainConstructor | null];
}

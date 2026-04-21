import { Registry } from '../../../../infrastructure/repository/registry';
import { UserAction } from '../../../enums/user-action';
import { DomainConstructor } from '../../../strategies/abstracts/base-application-strategy';
import { DecoratorTextHelper } from '../decorator-text-helper';
import { BaseHelperStrategy } from './abstracts/base-helper-strategy';

export class SwitchModelStrategy extends BaseHelperStrategy {
  private aliases: Record<string, DomainConstructor> = this.buildAliases();

  constructor() {
    super();
  }

  private buildAliases(): Record<string, DomainConstructor> {
    const aliases: Record<string, DomainConstructor> = {};
    const registry = new Registry();

    for (const domainName of registry.availableDomains()) {
      const domainCls = registry.create(domainName).domainClass ?? null;
      if (domainCls) {
        aliases[DecoratorTextHelper.normalizeText(domainCls.name).replace(/ /g, '')] = domainCls;
        const domainDisplay = domainCls.getDomainName?.();
        if (domainDisplay) {
          aliases[DecoratorTextHelper.normalizeText(domainDisplay).replace(/ /g, '')] = domainCls;
        }
      }
    }
    return aliases;
  }

  private resolveDomain(normalized: string, tokens: string[]): DomainConstructor | null {
    const options = Object.keys(this.aliases);

    for (const token of tokens) {
      const match = DecoratorTextHelper.bestMatch(DecoratorTextHelper.normalizeText(token).replace(/ /g, ''), options, 0.75);
      if (match) return this.aliases[match];
    }

    const match = DecoratorTextHelper.bestMatch(DecoratorTextHelper.normalizeText(normalized).replace(/ /g, ''), options, 0.70);
    return match ? this.aliases[match] : null;
  }

  override canHandle(normalized: string, tokens: string[]): boolean {
    return this.resolveDomain(normalized, tokens) !== null;
  }

  override handle(normalized: string, tokens: string[]): [UserAction, DomainConstructor | null] {
    return [UserAction.SWITCH_MODEL, this.resolveDomain(normalized, tokens)];
  }
}

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../../interfaces';
import { ErrorMessageChainHandler } from '../i-error-message-chain-handler';

export abstract class BaseErrorMessageChainHandler implements ErrorMessageChainHandler {
  private next?: ErrorMessageChainHandler;

  setNext(next: ErrorMessageChainHandler): ErrorMessageChainHandler {
    this.next = next;
    return next;
  }

  handle(type: ErrorType, context: ErrorContext): UserFriendlyMessage {
    if (this.canHandle(type)) {
      return this.buildMessage(context);
    }

    if (!this.next) {
      return {
        content: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      };
    }

    return this.next.handle(type, context);
  }

  protected buildPrefix(context: ErrorContext): string {
    const moment = this.normalizeMoment(context.moment);

    if (context.module === 'chat') {
      return `Não foi possível ${context.action} no ${context.module} ${moment}. `;
    }

    if (context.module === 'autenticação') {
      return `Não foi possível ${context.action} na ${context.module} ${moment}. `;
    }

    if (context.module === 'aplicação') {
      return `Não foi possível ${context.action} ${moment}. `;
    }

    return `Não foi possível ${context.action} no módulo ${context.module} ${moment}. `;
  }

  protected abstract canHandle(type: ErrorType): boolean;

  protected abstract buildMessage(context: ErrorContext): UserFriendlyMessage;

  private normalizeMoment(moment: string): string {
    const normalized = moment.trim().replace(/\.+$/g, '');
    return normalized || 'durante a operação';
  }
}

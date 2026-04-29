import { Injectable } from '@angular/core';

import { ServiceErrorContext } from '../contracts/service-error-context.interface';
import { ErrorContext } from '../interfaces/i-error-context';

@Injectable({
  providedIn: 'root',
})

export class ErrorContextExtractorService {
  extract(context: ServiceErrorContext): ErrorContext {
    return {
      module: this.resolveModule(context),
      action: this.resolveAction(context),
      moment: context.moment?.trim() || 'durante a operação',
    };
  }

  private resolveModule(context: ServiceErrorContext): string {
    const explicitModule = context.module?.trim();
    if (explicitModule) {
      return explicitModule;
    }

    const source = `${context.source} ${context.operation}`.toLowerCase();
    if (source.includes('assistant') || source.includes('chat')) {
      return 'chat';
    }

    if (source.includes('auth') || source.includes('login')) {
      return 'autenticação';
    }

    return 'aplicação';
  }

  private resolveAction(context: ServiceErrorContext): string {
    const explicitAction = context.userAction?.trim();
    if (explicitAction) {
      return explicitAction;
    }

    const operation = context.operation.toLowerCase();
    if (operation.includes('sendmessage') || operation.includes('/assistant')) {
      return 'enviar sua mensagem';
    }

    if (operation.includes('getproviders')) {
      return 'carregar os provedores';
    }

    if (operation.includes('getmodels')) {
      return 'carregar os modelos';
    }

    if (operation.includes('changeprovider')) {
      return 'trocar o provedor';
    }

    if (operation.includes('handleerror')) {
      return 'continuar usando a aplicação';
    }

    return 'concluir sua solicitação';
  }
}

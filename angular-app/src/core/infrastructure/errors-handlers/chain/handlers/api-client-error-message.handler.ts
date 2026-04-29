import { Injectable } from '@angular/core';

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../../interfaces';
import { BaseErrorMessageChainHandler } from '../abstracts/base-error-message-chain-handler';

@Injectable({
  providedIn: 'root',
})

export class ApiClientErrorMessageHandler extends BaseErrorMessageChainHandler {
  protected canHandle(type: ErrorType): boolean {
    return type === 'api-client';
  }

  protected buildMessage(context: ErrorContext): UserFriendlyMessage {
    return {
      content: `${this.buildPrefix(context)}Não foi possível concluir sua solicitação. Verifique os dados e tente novamente.`,
    };
  }
}

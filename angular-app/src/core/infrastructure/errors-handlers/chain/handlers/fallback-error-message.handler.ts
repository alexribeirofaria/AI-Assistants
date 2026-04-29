import { Injectable } from '@angular/core';

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../../interfaces';
import { BaseErrorMessageChainHandler } from '../abstracts/base-error-message-chain-handler';

@Injectable({
  providedIn: 'root',
})

export class FallbackErrorMessageHandler extends BaseErrorMessageChainHandler {
  protected canHandle(type: ErrorType): boolean {
    void type;
    return true;
  }

  protected buildMessage(context: ErrorContext): UserFriendlyMessage {
    return {
      content: `${this.buildPrefix(context)} Tente novamente com outro Provider ou Modelo.`,
    };
  }
}

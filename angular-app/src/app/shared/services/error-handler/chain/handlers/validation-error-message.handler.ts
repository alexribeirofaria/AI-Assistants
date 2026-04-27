import { Injectable } from '@angular/core';

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../../interfaces/';
import { BaseErrorMessageChainHandler } from '../abstracts/base-error-message-chain-handler';

@Injectable({
  providedIn: 'root',
})

export class ValidationErrorMessageHandler extends BaseErrorMessageChainHandler {
  protected canHandle(type: ErrorType): boolean {
    return type === 'validation';
  }

  protected buildMessage(context: ErrorContext): UserFriendlyMessage {
    return {
      content: `${this.buildPrefix(context)}Revise os dados informados e tente novamente.`,
    };
  }
}

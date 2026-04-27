import { Injectable } from '@angular/core';

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../../interfaces/';
import { BaseErrorMessageChainHandler } from '../abstracts/base-error-message-chain-handler';

@Injectable({
  providedIn: 'root',
})

export class NetworkTimeoutErrorMessageHandler extends BaseErrorMessageChainHandler {
  protected canHandle(type: ErrorType): boolean {
    return type === 'network-timeout';
  }

  protected buildMessage(context: ErrorContext): UserFriendlyMessage {
    return {
      content: `${this.buildPrefix(context)}A requisição demorou mais do que o esperado. Tente novamente.`,
    };
  }
}

import { Injectable } from '@angular/core';

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../interfaces';
import { ApiAuthErrorMessageHandler } from './handlers/api-auth-error-message.handler';
import { ApiClientErrorMessageHandler } from './handlers/api-client-error-message.handler';
import { ApiServerErrorMessageHandler } from './handlers/api-server-error-message.handler';
import { FallbackErrorMessageHandler } from './handlers/fallback-error-message.handler';
import { NetworkOfflineErrorMessageHandler } from './handlers/network-offline-error-message.handler';
import { NetworkTimeoutErrorMessageHandler } from './handlers/network-timeout-error-message.handler';
import { ValidationErrorMessageHandler } from './handlers/validation-error-message.handler';

@Injectable({
  providedIn: 'root',
})

export class ErrorMessageChainService {
  constructor(
    private readonly networkTimeout: NetworkTimeoutErrorMessageHandler,
    private readonly networkOffline: NetworkOfflineErrorMessageHandler,
    private readonly apiAuth: ApiAuthErrorMessageHandler,
    private readonly apiServer: ApiServerErrorMessageHandler,
    private readonly apiClient: ApiClientErrorMessageHandler,
    private readonly validation: ValidationErrorMessageHandler,
    private readonly fallback: FallbackErrorMessageHandler
  ) { }

  resolve(type: ErrorType, context: ErrorContext): UserFriendlyMessage {
    this.networkTimeout
      .setNext(this.networkOffline)
      .setNext(this.apiAuth)
      .setNext(this.apiServer)
      .setNext(this.apiClient)
      .setNext(this.validation)
      .setNext(this.fallback);

    return this.networkTimeout.handle(type, context);
  }
}

import { ErrorContext, ErrorType, UserFriendlyMessage } from '../interfaces';

export interface ErrorMessageChainHandler {
  setNext(next: ErrorMessageChainHandler): ErrorMessageChainHandler;
  handle(type: ErrorType, context: ErrorContext): UserFriendlyMessage;
}

import { DomainError } from './domain-error';

export class ChatGatewayError extends DomainError {
  constructor(message: string, source: string, public readonly details?: any) {
    super(message, 'CHAT_GATEWAY_FAILURE', source);
  }
}

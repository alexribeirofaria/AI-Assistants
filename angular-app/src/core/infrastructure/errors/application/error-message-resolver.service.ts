import { Injectable } from '@angular/core';
import { ErrorSeverity } from '../domain/error-severity.enum';
import { ChatErrorMapper } from '../mappers/chat-error.mapper';
import { ErrorContext } from '../contracts/i-error-context';
import { ErrorContext as ErrorContextType } from '../domain/error-context.enum';
import { HttpStatusInterpreter } from '../mappers/http-status-interpreter';

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageResolverService {
  private static readonly GLOBAL_FALLBACK = 'Ocorreu um erro inesperado. Tente novamente.';

  constructor(private readonly chatMapper: ChatErrorMapper) {}

  resolve(operation: string, severity: ErrorSeverity, originalMessage?: string, context?: ErrorContext): string {
    // 1. Check for HTTP interpretation if available or context is HTTP
    if (context?.context === ErrorContextType.Http || context?.category === 'network') {
      const status = context.details?.['status'];
      if (typeof status === 'number') {
        const interpretation = HttpStatusInterpreter.interpret(status);
        return interpretation.userMessage;
      }
    }

    // 2. Try to resolve using domain mappers
    // We always check the ChatMapper for technical markers, even in global channel
    const chatMessage = this.chatMapper.resolve(operation, originalMessage);
    
    // If it's a chat channel, or if the mapper found a specific technical message, use it
    const isChat = context?.channel === 'chat' || context?.context === ErrorContextType.Chat;
    if (chatMessage && (isChat || this.chatMapper.isFriendlyMessage(chatMessage))) {
      return chatMessage;
    }

    // 3. Check for known friendly messages if already present
    if (originalMessage && this.chatMapper.isFriendlyMessage(originalMessage)) {
      return originalMessage;
    }

    // 4. Global Fallback for critical/high errors
    if (severity === ErrorSeverity.Critical || severity === ErrorSeverity.High) {
      return ErrorMessageResolverService.GLOBAL_FALLBACK;
    }

    // 5. Generic fallback
    return 'Não foi possível completar a operação.';
  }
}

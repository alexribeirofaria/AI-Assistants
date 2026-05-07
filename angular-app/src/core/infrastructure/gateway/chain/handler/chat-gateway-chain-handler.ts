import { IChatGateway } from '../../interfaces';
import { IGatewayChainContext } from '../interfaces';

export class ChatGatewayChainHandler {
  private next: ChatGatewayChainHandler | null = null;

  constructor(private readonly gateway: IChatGateway) {}

  setNext(handler: ChatGatewayChainHandler): ChatGatewayChainHandler {
    this.next = handler;
    return handler;
  }

  async handle<TResult>(context: IGatewayChainContext<TResult>): Promise<TResult> {
    const operation = context.operationName ?? 'unknown-operation';
    const currentGatewayName = this.getGatewayName(this.gateway);
    context.observer?.onAttempt?.({
      operation,
      gatewayName: currentGatewayName,
    });

    try {
      const result = await context.operation(this.gateway);

      if (context.validate && !context.validate(result)) {
        throw new Error(context.invalidResultMessage ?? 'Gateway retornou resposta invalida');
      }

      context.observer?.onSuccess?.({
        operation,
        gatewayName: currentGatewayName,
      });

      return result;
    } catch (error) {
      const normalizedError = this.normalizeError(error);

      if (this.next) {
        context.observer?.onFallback?.({
          operation,
          fromGateway: currentGatewayName,
          toGateway: this.getGatewayName(this.next.gateway),
          error: normalizedError,
        });

        return this.next.handle(context);
      }

      context.observer?.onFailure?.({
        operation,
        gatewayName: currentGatewayName,
        error: normalizedError,
      });

      throw normalizedError;
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    if (typeof error === 'string') {
      return new Error(error);
    }

    if (error && typeof error === 'object') {
      const message = (error as { message?: unknown }).message;
      if (typeof message === 'string' && message.trim().length > 0) {
        return new Error(message);
      }

      try {
        return new Error(JSON.stringify(error));
      } catch {
        return new Error('Erro desconhecido no gateway');
      }
    }

    return new Error(String(error));
  }

  private getGatewayName(gateway: IChatGateway): string {
    const ctor = gateway.constructor as { name?: string };
    if (ctor && typeof ctor.name === 'string' && ctor.name.length > 0) {
      return ctor.name;
    }

    return 'UnknownGateway';
  }
}

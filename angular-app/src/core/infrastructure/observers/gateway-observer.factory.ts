import { GatewayChainObserver } from "../gateway";
import { GatewayFailureReporter, SendMessageObserverState } from "./interfaces";

export class ChatGatewayObserverFactory {
  private static readonly SHOW_TO_USER = true;
  private static readonly HIDE_FROM_USER = false;

  constructor(private readonly reportFailure: GatewayFailureReporter) {}

  createSilentObserver(): GatewayChainObserver {
    return {
      onFallback: ({ operation, fromGateway, toGateway, error }) => {
        this.reportFailure({
          error,
          gatewayName: fromGateway,
          operation,
          details: { toGateway },
          presentToUser: ChatGatewayObserverFactory.HIDE_FROM_USER,
        });
      },
      onFailure: ({ operation, gatewayName, error }) => {
        this.reportFailure({
          error,
          gatewayName,
          operation,
          presentToUser: ChatGatewayObserverFactory.HIDE_FROM_USER,
        });
      },
    };
  }

  createInteractiveSendObserver(state: SendMessageObserverState): GatewayChainObserver {
    return {
      onFallback: ({ operation, fromGateway, toGateway, error }) => {
        state.markFallbackUsed();
        state.setGatewayStatus(`Falha em ${fromGateway}. Alternando para ${toGateway}...`);
        this.reportFailure({
          error,
          gatewayName: fromGateway,
          operation,
          details: { toGateway },
          presentToUser: ChatGatewayObserverFactory.HIDE_FROM_USER,
        });
      },
      onSuccess: ({ gatewayName }) => {
        if (!state.isFallbackUsed()) {
          state.setGatewayStatus('');
          return;
        }

        state.setGatewayStatus(`Resposta recebida via ${gatewayName}.`);
      },
      onFailure: ({ operation, gatewayName, error }) => {
        state.setGatewayStatus('');
        this.reportFailure({
          error,
          gatewayName,
          operation,
          presentToUser: ChatGatewayObserverFactory.SHOW_TO_USER,
        });
      },
    };
  }
}

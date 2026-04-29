import {
  IGatewayObserverAttemptEvent,
  IGatewayObserverFailureEvent,
  IGatewayObserverFallbackEvent,
  IGatewayObserverSuccessEvent,
} from './events';

export interface GatewayChainObserver {
  onAttempt?(event: IGatewayObserverAttemptEvent): void;
  onFallback?(event: IGatewayObserverFallbackEvent): void;
  onSuccess?(event: IGatewayObserverSuccessEvent): void;
  onFailure?(event: IGatewayObserverFailureEvent): void;
}

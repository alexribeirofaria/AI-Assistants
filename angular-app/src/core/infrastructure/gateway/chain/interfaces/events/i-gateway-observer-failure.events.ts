export interface IGatewayObserverFailureEvent {
  operation: string;
  gatewayName: string;
  error: Error;
}

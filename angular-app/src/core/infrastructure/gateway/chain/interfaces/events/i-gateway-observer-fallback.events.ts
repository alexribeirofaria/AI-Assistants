export interface IGatewayObserverFallbackEvent {
  operation: string;
  fromGateway: string;
  toGateway: string;
  error: Error;
}

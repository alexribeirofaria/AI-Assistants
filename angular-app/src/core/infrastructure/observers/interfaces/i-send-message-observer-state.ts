import { GatewayFailureReport } from "./i-gateway-fFailure-report";

export interface SendMessageObserverState {
  markFallbackUsed(): void;
  isFallbackUsed(): boolean;
  setGatewayStatus(status: string): void;
}

export type GatewayFailureReporter = (report: GatewayFailureReport) => void;

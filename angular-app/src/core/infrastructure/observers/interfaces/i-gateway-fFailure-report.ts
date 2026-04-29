export interface GatewayFailureReport {
  error: unknown;
  gatewayName: string;
  operation: string;
  details?: Record<string, unknown>;
  presentToUser: boolean;
}

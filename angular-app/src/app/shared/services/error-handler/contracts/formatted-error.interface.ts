import { ErrorChannel } from './error-channel.type';

export interface FormattedError {
  id: string;
  destination: string;
  timestamp: string;
  source: string;
  operation: string;
  errorType: string;
  technicalMessage: string;
  publicMessage: string;
  statusCode?: number;
  statusText?: string;
  stack?: string;
  details?: Record<string, unknown>;
  channel: ErrorChannel;
  signature: string;
}

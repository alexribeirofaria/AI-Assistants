import { ErrorChannel } from './error-channel.type';

export interface ServiceErrorContext {
  source: string;
  operation: string;
  details?: Record<string, unknown>;
  channel?: ErrorChannel;
  presentToUser?: boolean;
}

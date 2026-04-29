import { ErrorChannel } from './error-channel.type';

export interface ServiceErrorContext {
  source: string;
  operation: string;
  module?: string;
  userAction?: string;
  moment?: string;
  details?: Record<string, unknown>;
  channel?: ErrorChannel;
  presentToUser?: boolean;
}

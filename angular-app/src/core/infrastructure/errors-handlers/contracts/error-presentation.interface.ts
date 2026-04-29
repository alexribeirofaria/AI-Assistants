import { ErrorChannel } from './error-channel.type';

export interface ErrorPresentation {
  message: string;
  channel: ErrorChannel;
}

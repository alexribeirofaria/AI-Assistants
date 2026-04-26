import { IChatGateway } from '../../i-chat-gateway';
import { GatewayChainObserver } from './i-gateway-chain-observer';

export interface IGatewayChainContext<TResult> {
  operation: (gateway: IChatGateway) => Promise<TResult>;
  validate?: (result: TResult) => boolean;
  invalidResultMessage?: string;
  operationName?: string;
  observer?: GatewayChainObserver;
}

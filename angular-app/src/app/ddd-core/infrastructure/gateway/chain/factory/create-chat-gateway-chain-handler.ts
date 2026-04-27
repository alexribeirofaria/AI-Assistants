import { IChatGateway } from '../../interfaces';
import { ChatGatewayChainHandler } from '../handler/chat-gateway-chain-handler';

export const createChatGatewayChainHandler = (
  gateways: readonly IChatGateway[]
): ChatGatewayChainHandler => {
  if (gateways.length === 0) {
    throw new Error('Pelo menos um gateway deve ser informado para montar a chain');
  }

  const [firstGateway, ...remainingGateways] = gateways;
  const rootHandler = new ChatGatewayChainHandler(firstGateway);
  let currentHandler = rootHandler;

  for (const gateway of remainingGateways) {
    currentHandler = currentHandler.setNext(new ChatGatewayChainHandler(gateway));
  }

  return rootHandler;
};

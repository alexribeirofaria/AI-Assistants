import { IChatGateway } from '../../interfaces';
import { createChatGatewayChainHandler } from './create-chat-gateway-chain-handler';

describe('createChatGatewayChainHandler Unit Tests', () => {
  const createGatewaySpy = (): jasmine.SpyObj<IChatGateway> =>
    jasmine.createSpyObj<IChatGateway>('IChatGateway', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);

  it('throws when no gateways are provided', () => {
    expect(() => createChatGatewayChainHandler([])).toThrowError(
      'Pelo menos um gateway deve ser informado para montar a chain'
    );
  });

  it('creates a chain that delegates to fallback gateway', async () => {
    const primaryGateway = createGatewaySpy();
    const secondaryGateway = createGatewaySpy();

    primaryGateway.getProviders.and.rejectWith(new Error('primary failure'));
    secondaryGateway.getProviders.and.resolveTo(['fallback']);

    const chain = createChatGatewayChainHandler([primaryGateway, secondaryGateway]);
    await expectAsync(chain.handle({
      operation: (gateway) => gateway.getProviders(),
      operationName: 'getProviders',
    })).toBeResolvedTo(['fallback']);
  });
});

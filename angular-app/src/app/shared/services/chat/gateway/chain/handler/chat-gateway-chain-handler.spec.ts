import { IChatGateway } from '../../interfaces';
import { createChatGatewayChainHandler } from '../factory';
import { ChatGatewayChainHandler } from './chat-gateway-chain-handler';

describe('ChatGatewayChainHandler Unit Tests', () => {
  const createGatewaySpy = (): jasmine.SpyObj<IChatGateway> =>
    jasmine.createSpyObj<IChatGateway>('IChatGateway', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);

  it('returns the current handler result when operation succeeds', async () => {
    const primaryGateway = createGatewaySpy();
    const secondaryGateway = createGatewaySpy();

    primaryGateway.getProviders.and.resolveTo(['openai']);
    secondaryGateway.getProviders.and.resolveTo(['groq']);

    const rootHandler = new ChatGatewayChainHandler(primaryGateway);
    rootHandler.setNext(new ChatGatewayChainHandler(secondaryGateway));

    await expectAsync(
      rootHandler.handle({
        operation: (gateway) => gateway.getProviders(),
      })
    ).toBeResolvedTo(['openai']);

    expect(primaryGateway.getProviders).toHaveBeenCalledTimes(1);
    expect(secondaryGateway.getProviders).not.toHaveBeenCalled();
  });

  it('delegates to next handler when current handler throws', async () => {
    const primaryGateway = createGatewaySpy();
    const secondaryGateway = createGatewaySpy();

    primaryGateway.getProviders.and.rejectWith(new Error('primary error'));
    secondaryGateway.getProviders.and.resolveTo(['fallback']);

    const rootHandler = createChatGatewayChainHandler([primaryGateway, secondaryGateway]);

    await expectAsync(
      rootHandler.handle({
        operation: (gateway) => gateway.getProviders(),
      })
    ).toBeResolvedTo(['fallback']);

    expect(primaryGateway.getProviders).toHaveBeenCalledTimes(1);
    expect(secondaryGateway.getProviders).toHaveBeenCalledTimes(1);
  });

  it('notifies observer when fallback between gateways happens', async () => {
    const primaryGateway = createGatewaySpy();
    const secondaryGateway = createGatewaySpy();
    const observer = jasmine.createSpyObj('GatewayChainObserver', [
      'onAttempt',
      'onFallback',
      'onSuccess',
      'onFailure',
    ]);

    primaryGateway.sendMessage.and.rejectWith(new Error('http failure'));
    secondaryGateway.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'core fallback answer' },
    });

    const rootHandler = createChatGatewayChainHandler([primaryGateway, secondaryGateway]);

    await expectAsync(
      rootHandler.handle({
        operation: (gateway) => gateway.sendMessage('hello'),
        operationName: 'sendMessage',
        observer,
      })
    ).toBeResolvedTo({
      input: 'hello',
      response: { response: 'core fallback answer' },
    });

    expect(observer.onFallback).toHaveBeenCalledTimes(1);
    expect(observer.onFallback).toHaveBeenCalledWith(
      jasmine.objectContaining({
        operation: 'sendMessage',
        fromGateway: 'Object',
        toGateway: 'Object',
      })
    );
    expect(observer.onSuccess).toHaveBeenCalledTimes(1);
    expect(observer.onFailure).not.toHaveBeenCalled();
  });

  it('delegates to next handler when current response is invalid', async () => {
    const primaryGateway = createGatewaySpy();
    const secondaryGateway = createGatewaySpy();

    primaryGateway.getModels.and.resolveTo({
      defaultModel: 'x',
      models: null as unknown as never[],
    });
    secondaryGateway.getModels.and.resolveTo({
      defaultModel: 'y',
      models: [{ id: 'y', modelName: 'Model Y', provider: 'fallback' }],
    });

    const rootHandler = createChatGatewayChainHandler([primaryGateway, secondaryGateway]);

    await expectAsync(
      rootHandler.handle({
        operation: (gateway) => gateway.getModels(),
        validate: (response) => Array.isArray(response.models),
        invalidResultMessage: 'Gateway retornou models invalidos',
      })
    ).toBeResolvedTo({
      defaultModel: 'y',
      models: [{ id: 'y', modelName: 'Model Y', provider: 'fallback' }],
    });

    expect(primaryGateway.getModels).toHaveBeenCalledTimes(1);
    expect(secondaryGateway.getModels).toHaveBeenCalledTimes(1);
  });

  it('throws the last error when no next handler exists', async () => {
    const primaryGateway = createGatewaySpy();

    primaryGateway.getProviders.and.rejectWith(new Error('primary fatal'));

    const rootHandler = new ChatGatewayChainHandler(primaryGateway);

    await expectAsync(
      rootHandler.handle({
        operation: (gateway) => gateway.getProviders(),
      })
    ).toBeRejectedWithError('primary fatal');
  });
});

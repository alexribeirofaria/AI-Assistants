import { IChatGateway } from '../i-chat-gateway';
import { ChatGatewayChain } from './chat-gateway-chain';

describe('ChatGatewayChain Unit Tests', () => {
  const createGatewaySpy = (): jasmine.SpyObj<IChatGateway> =>
    jasmine.createSpyObj<IChatGateway>('IChatGateway', [
      'getProviders',
      'getModels',
      'getDefaultModel',
      'changeProvider',
      'sendMessage',
    ]);

  it('falls back to secondary when primary fails on getProviders', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();
    primary.getProviders.and.rejectWith(new Error('primary offline'));
    secondary.getProviders.and.resolveTo(['core']);

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.getProviders()).toBeResolvedTo(['core']);
  });

  it('falls back to secondary when primary returns invalid models payload', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();

    primary.getModels.and.resolveTo({
      defaultModel: 'bad',
      models: null as unknown as never[],
    });
    secondary.getModels.and.resolveTo({
      defaultModel: 'ok',
      models: [{ id: 'ok', modelName: 'ok', provider: 'core' }],
    });

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.getModels('openai')).toBeResolvedTo({
      defaultModel: 'ok',
      models: [{ id: 'ok', modelName: 'ok', provider: 'core' }],
    });
  });

  it('falls back to secondary when primary returns blank default model', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();

    primary.getDefaultModel.and.resolveTo('   ');
    secondary.getDefaultModel.and.resolveTo('core-model');

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.getDefaultModel('openai')).toBeResolvedTo('core-model');
  });

  it('returns undefined when all gateways return missing default model', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();

    primary.getDefaultModel.and.resolveTo(undefined);
    secondary.getDefaultModel.and.resolveTo(undefined);

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.getDefaultModel('openai')).toBeResolvedTo(undefined);
  });

  it('throws when all gateways return blank default model', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();

    primary.getDefaultModel.and.resolveTo(' ');
    secondary.getDefaultModel.and.resolveTo('   ');

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.getDefaultModel('openai')).toBeRejectedWithError(
      'Gateway retornou default model invalido'
    );
  });

  it('falls back to secondary when primary sendMessage response is empty', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();

    primary.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: '   ' },
    });
    secondary.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback' },
    });

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.sendMessage('hello')).toBeResolvedTo({
      input: 'hello',
      response: { response: 'fallback' },
    });
  });

  it('falls back to secondary when primary sendMessage status code is not 200', async () => {
    const primary = createGatewaySpy();
    const secondary = createGatewaySpy();

    primary.sendMessage.and.resolveTo({
      input: 'hello',
      statusCode: 500,
      response: { response: 'primary non-200 response' },
    });
    secondary.sendMessage.and.resolveTo({
      input: 'hello',
      response: { response: 'fallback' },
    });

    const chain = new ChatGatewayChain([primary, secondary]);

    await expectAsync(chain.sendMessage('hello')).toBeResolvedTo({
      input: 'hello',
      response: { response: 'fallback' },
    });
  });
});

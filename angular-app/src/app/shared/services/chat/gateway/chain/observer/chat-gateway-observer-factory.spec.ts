import { ChatGatewayObserverFactory, GatewayFailureReport, SendMessageObserverState } from './chat-gateway-observer-factory';

describe('ChatGatewayObserverFactory Unit Tests', () => {
  let reports: GatewayFailureReport[];
  let factory: ChatGatewayObserverFactory;

  beforeEach(() => {
    reports = [];
    factory = new ChatGatewayObserverFactory((report) => {
      reports.push(report);
    });
  });

  it('creates silent observer that logs fallback and failure without user presentation', () => {
    const observer = factory.createSilentObserver();

    observer.onFallback?.({
      operation: 'getModels',
      fromGateway: 'CoreChatGateway',
      toGateway: 'HttpChatGateway',
      error: new Error('primary failure'),
    });
    observer.onFailure?.({
      operation: 'getModels',
      gatewayName: 'HttpChatGateway',
      error: new Error('secondary failure'),
    });

    expect(reports.length).toBe(2);
    expect(reports[0]).toEqual(jasmine.objectContaining({
      gatewayName: 'CoreChatGateway',
      operation: 'getModels',
      presentToUser: false,
      details: { toGateway: 'HttpChatGateway' },
    }));
    expect(reports[1]).toEqual(jasmine.objectContaining({
      gatewayName: 'HttpChatGateway',
      operation: 'getModels',
      presentToUser: false,
    }));
  });

  it('creates interactive observer that updates status and logs fallback silently', () => {
    let usedFallback = false;
    let status = '';
    const state: SendMessageObserverState = {
      markFallbackUsed: () => {
        usedFallback = true;
      },
      isFallbackUsed: () => usedFallback,
      setGatewayStatus: (value: string) => {
        status = value;
      },
    };

    const observer = factory.createInteractiveSendObserver(state);
    observer.onFallback?.({
      operation: 'sendMessage',
      fromGateway: 'CoreChatGateway',
      toGateway: 'HttpChatGateway',
      error: new Error('fallback'),
    });
    observer.onSuccess?.({
      operation: 'sendMessage',
      gatewayName: 'HttpChatGateway',
    });

    expect(status).toBe('Resposta recebida via HttpChatGateway.');
    expect(reports.length).toBe(1);
    expect(reports[0]).toEqual(jasmine.objectContaining({
      operation: 'sendMessage',
      gatewayName: 'CoreChatGateway',
      presentToUser: false,
      details: { toGateway: 'HttpChatGateway' },
    }));
  });

  it('keeps status empty on success without fallback', () => {
    let status = 'initial';
    const state: SendMessageObserverState = {
      markFallbackUsed: () => undefined,
      isFallbackUsed: () => false,
      setGatewayStatus: (value: string) => {
        status = value;
      },
    };

    const observer = factory.createInteractiveSendObserver(state);
    observer.onSuccess?.({
      operation: 'sendMessage',
      gatewayName: 'CoreChatGateway',
    });

    expect(status).toBe('');
    expect(reports.length).toBe(0);
  });

  it('logs final interactive failure as user-visible', () => {
    let status = 'pending';
    const state: SendMessageObserverState = {
      markFallbackUsed: () => undefined,
      isFallbackUsed: () => false,
      setGatewayStatus: (value: string) => {
        status = value;
      },
    };

    const observer = factory.createInteractiveSendObserver(state);
    observer.onFailure?.({
      operation: 'sendMessage',
      gatewayName: 'HttpChatGateway',
      error: new Error('all failed'),
    });

    expect(status).toBe('');
    expect(reports.length).toBe(1);
    expect(reports[0]).toEqual(jasmine.objectContaining({
      operation: 'sendMessage',
      gatewayName: 'HttpChatGateway',
      presentToUser: true,
    }));
  });
});

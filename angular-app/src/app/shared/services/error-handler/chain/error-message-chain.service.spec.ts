import { TestBed } from '@angular/core/testing';

import { ErrorMessageChainService } from './error-message-chain.service';

describe('ErrorMessageChainService Unit Tests', () => {
  let service: ErrorMessageChainService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorMessageChainService],
    });

    service = TestBed.inject(ErrorMessageChainService);
  });

  it('resolves timeout messages through the chain', () => {
    const message = service.resolve('network-timeout', {
      module: 'chat',
      action: 'enviar sua mensagem',
      moment: 'durante o envio',
    });

    expect(message.content).toBe('Não foi possível enviar sua mensagem no chat durante o envio. A requisição demorou mais do que o esperado. Tente novamente.');
  });

  it('resolves offline messages through the chain', () => {
    const message = service.resolve('network-offline', {
      module: 'chat',
      action: 'enviar sua mensagem',
      moment: 'durante o envio',
    });

    expect(message.content).toBe('Não foi possível enviar sua mensagem no chat durante o envio. Sem conexão com a internet. Verifique sua rede.');
  });

  it('resolves authorization messages through the chain', () => {
    const message = service.resolve('api-forbidden', {
      module: 'autenticação',
      action: 'entrar na conta',
      moment: 'ao confirmar o acesso',
    });

    expect(message.content).toBe('Não foi possível entrar na conta na autenticação ao confirmar o acesso. Você não tem permissão para realizar esta ação.');
  });

  it('uses fallback for unknown types', () => {
    const message = service.resolve('unexpected', {
      module: 'aplicação',
      action: 'concluir sua solicitação',
      moment: 'durante a operação',
    });

    expect(message.content).toBe('Não foi possível concluir sua solicitação durante a operação. Ocorreu um erro inesperado. Tente novamente mais tarde.');
  });
});

import { TestBed } from '@angular/core/testing';

import { ChatUiErrorStateService } from './chat-ui-error-state.service';
import { GlobalUiErrorStateService } from './global-ui-error-state.service';
import { UIErrorPresenterService } from './ui-error-presenter.service';

describe('UIErrorPresenterService Unit Tests', () => {
  let service: UIErrorPresenterService;
  let chatUiErrorState: jasmine.SpyObj<ChatUiErrorStateService>;
  let globalUiErrorState: jasmine.SpyObj<GlobalUiErrorStateService>;

  beforeEach(() => {
    chatUiErrorState = jasmine.createSpyObj<ChatUiErrorStateService>('ChatUiErrorStateService', ['show', 'clear']);
    globalUiErrorState = jasmine.createSpyObj<GlobalUiErrorStateService>('GlobalUiErrorStateService', ['show', 'clear']);

    TestBed.configureTestingModule({
      providers: [
        UIErrorPresenterService,
        { provide: ChatUiErrorStateService, useValue: chatUiErrorState },
        { provide: GlobalUiErrorStateService, useValue: globalUiErrorState },
      ],
    });

    service = TestBed.inject(UIErrorPresenterService);
  });

  it('routes chat errors to chat ui state', () => {
    service.present({
      message: 'Não foi possível enviar sua mensagem no chat durante o envio. Sem conexão com a internet. Verifique sua rede.',
      channel: 'chat',
    });

    expect(chatUiErrorState.show).toHaveBeenCalledOnceWith(
      'Não foi possível enviar sua mensagem no chat durante o envio. Sem conexão com a internet. Verifique sua rede.'
    );
    expect(globalUiErrorState.show).not.toHaveBeenCalled();
  });

  it('routes non-chat errors to global ui state', () => {
    service.present({
      message: 'Não foi possível concluir sua solicitação durante a operação. Ocorreu um erro inesperado. Tente novamente mais tarde.',
      channel: 'global',
    });

    expect(globalUiErrorState.show).toHaveBeenCalledOnceWith(
      'Não foi possível concluir sua solicitação durante a operação. Ocorreu um erro inesperado. Tente novamente mais tarde.'
    );
    expect(chatUiErrorState.show).not.toHaveBeenCalled();
  });
});

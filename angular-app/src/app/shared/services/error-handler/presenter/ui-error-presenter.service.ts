import { Injectable } from '@angular/core';

import { ErrorPresentation } from '../contracts/error-presentation.interface';
import { ChatUiErrorStateService } from './chat-ui-error-state.service';
import { GlobalUiErrorStateService } from './global-ui-error-state.service';

@Injectable({
  providedIn: 'root',
})
export class UIErrorPresenterService {
  constructor(
    private readonly globalUiErrorState: GlobalUiErrorStateService,
    private readonly chatUiErrorState: ChatUiErrorStateService
  ) {}

  present(presentation: ErrorPresentation): void {
    if (presentation.channel === 'chat') {
      this.chatUiErrorState.show(presentation.message);
      return;
    }

    this.globalUiErrorState.show(presentation.message);
  }
}

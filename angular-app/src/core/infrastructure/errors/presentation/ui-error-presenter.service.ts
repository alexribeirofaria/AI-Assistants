import { Injectable } from '@angular/core';
import { ChatUiErrorStateService } from '../state/chat-ui-error-state.service';
import { GlobalUiErrorStateService } from '../state/global-ui-error-state.service';

@Injectable({
  providedIn: 'root',
})
export class UiErrorPresenterService {
  constructor(
    private readonly globalState: GlobalUiErrorStateService,
    private readonly chatState: ChatUiErrorStateService,
  ) {}

  present(message: string, channel: 'chat' | 'global' = 'global'): void {
    if (channel === 'chat') {
      this.chatState.show(message);
      return;
    }

    this.globalState.show(message);
  }
}

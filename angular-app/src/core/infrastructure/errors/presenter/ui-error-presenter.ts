import { Injectable } from '@angular/core';
import { IUIErrorPresenter } from '../contracts/i-ui-error-presenter';
import { UiErrorPresenterService } from '../presentation/ui-error-presenter.service';

@Injectable({
  providedIn: 'root',
})
export class UIErrorPresenter implements IUIErrorPresenter {
  constructor(private readonly presenter: UiErrorPresenterService) {}

  present(message: string, channel: 'chat' | 'global' = 'global'): void {
    this.presenter.present(message, channel);
  }
}

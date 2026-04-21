import { OutputPresenterFactory } from './output_presenter_factory';
import { IOutputPresenter } from '../interfaces/i_output_presenter';

export class PresenterFactory {
  static createConsolePresenter(): IOutputPresenter {
    return new OutputPresenterFactory().createPresenter();
  }
}

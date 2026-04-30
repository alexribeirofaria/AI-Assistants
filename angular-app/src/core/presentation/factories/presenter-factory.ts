import { OutputPresenterFactory } from './output-presenter-factory';
import { IOutputPresenter } from '../interfaces/i-output-presenter';

export class PresenterFactory {
  static createConsolePresenter(): IOutputPresenter {
    return new OutputPresenterFactory().createPresenter();
  }
}

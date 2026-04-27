import { IOutputPresenter } from './i-output-presenter';

export interface IOutputPresenterFactory {
  createPresenter(): IOutputPresenter;
}

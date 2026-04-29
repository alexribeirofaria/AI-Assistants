import { OutputFormatter } from '../formatters/output-formatter';
import { IOutputPresenterFactory } from '../interfaces/i-output-presenter-factory';
import { OutputPresenter } from '../presenters/output-presenter';
import { OutputStream } from '../streams/output-stream';

export class OutputPresenterFactory implements IOutputPresenterFactory {
  createPresenter(): OutputPresenter {
    const formatter = new OutputFormatter();
    const stream = new OutputStream();
    return new OutputPresenter(formatter, stream);
  }
}

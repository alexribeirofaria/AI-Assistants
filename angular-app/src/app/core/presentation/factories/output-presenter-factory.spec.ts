import { OutputPresenterFactory } from './output-presenter-factory';
import { OutputPresenter } from '../presenters/output-presenter';

describe('OutputPresenterFactory', () => {
  it('should create presenter', () => {
    const factory = new OutputPresenterFactory();
    const presenter = factory.createPresenter();
    expect(presenter).toBeInstanceOf(OutputPresenter);
  });
});

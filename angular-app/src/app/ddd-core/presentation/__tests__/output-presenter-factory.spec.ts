import { OutputPresenterFactory } from '../factories/output-presenter-factory';

describe('OutputPresenterFactory', () => {
  it('creates a presenter instance', () => {
    expect(new OutputPresenterFactory().createPresenter()).toBeTruthy();
  });
});

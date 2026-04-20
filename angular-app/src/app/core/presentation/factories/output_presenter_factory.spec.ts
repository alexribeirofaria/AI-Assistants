import { OutputPresenterFactory } from './output_presenter_factory';

describe('OutputPresenterFactory', () => {
  it('should be instantiated', () => {
    const instance = new OutputPresenterFactory();
    expect(instance).toBeTruthy();
  });
});

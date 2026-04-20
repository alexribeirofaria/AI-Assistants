import { IOutputPresenterFactory } from './i_output_presenter_factory';

describe('IOutputPresenterFactory', () => {
  it('should be instantiated', () => {
    const instance = new IOutputPresenterFactory();
    expect(instance).toBeTruthy();
  });
});

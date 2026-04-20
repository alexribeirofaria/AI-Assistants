import { PresenterFactory } from './presenter_factory';

describe('PresenterFactory', () => {
  it('should be instantiated', () => {
    const instance = new PresenterFactory();
    expect(instance).toBeTruthy();
  });
});

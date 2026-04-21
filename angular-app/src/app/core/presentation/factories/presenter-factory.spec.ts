import { PresenterFactory } from './presenter-factory';

describe('PresenterFactory', () => {
  it('should create console presenter', () => {
    const presenter = PresenterFactory.createConsolePresenter();
    expect(presenter).toBeDefined();
    expect(typeof presenter.showUI).toBe('function');
  });
});

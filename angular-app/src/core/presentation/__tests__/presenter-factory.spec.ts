import { PresenterFactory } from '../factories/presenter-factory';

describe('PresenterFactory', () => {
  it('creates a console presenter', () => {
    expect(PresenterFactory.createConsolePresenter()).toBeTruthy();
  });
});

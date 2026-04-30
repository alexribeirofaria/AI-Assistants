import { IOutputPresenter } from '../../interfaces/i-output-presenter';

describe('IOutputPresenter', () => {
  let presenter: jasmine.SpyObj<IOutputPresenter> & IOutputPresenter;

  beforeEach(() => {
    presenter = jasmine.createSpyObj('IOutputPresenter', [
      'showUI',
      'showModelSwitched',
      'showInterpretedInput',
      'showResponse',
      'showLoadingModels',
      'showElapsedTime',
      'clearElapsedTime',
      'showModelList',
      'showWarning',
      'showError',
      'showGoodbye',
    ]) as jasmine.SpyObj<IOutputPresenter> & IOutputPresenter;
  });

  it('should have correct interface structure', () => {
    expect(presenter.showUI).toBeDefined();
    expect(typeof presenter.showUI).toBe('function');
  });
});
